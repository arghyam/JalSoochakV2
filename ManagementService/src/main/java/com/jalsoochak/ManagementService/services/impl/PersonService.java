package com.jalsoochak.ManagementService.services.impl;

import com.jalsoochak.ManagementService.clients.KeycloakClient;
import com.jalsoochak.ManagementService.config.KeycloakProvider;
import com.jalsoochak.ManagementService.models.app.request.InviteRequest;
import com.jalsoochak.ManagementService.models.app.request.LoginRequest;
import com.jalsoochak.ManagementService.models.app.request.RegisterRequest;
import com.jalsoochak.ManagementService.models.app.response.TokenResponse;
import com.jalsoochak.ManagementService.models.entity.InviteToken;
import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.entity.PersonSchemeMapping;
import com.jalsoochak.ManagementService.models.entity.PersonTypeMaster;
import com.jalsoochak.ManagementService.models.entity.SchemeMaster;
import com.jalsoochak.ManagementService.repositories.InviteTokenRepository;
import com.jalsoochak.ManagementService.repositories.PersonMasterRepository;
import com.jalsoochak.ManagementService.repositories.PersonSchemeMappingRepository;
import com.jalsoochak.ManagementService.repositories.PersonTypeMasterRepository;
import com.jalsoochak.ManagementService.repositories.SchemeMasterRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class PersonService {
    @Value("${keycloak.realm}")
    public String realm;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    private final KeycloakProvider keycloakProvider;
    private final PersonTypeMasterRepository personTypeMasterRepository;
    private final PersonMasterRepository personMasterRepository;
    private final InviteTokenRepository inviteTokenRepository;
    private final MailService mailService;
    private final PersonSchemeMappingRepository personSchemeMappingRepository;
    private final SchemeMasterRepository schemeMasterRepository;
    private final KeycloakClient keycloakClient;
    private static final String ALLOWED_PERSON_TYPE = "Pump Operator";


    private static final String NAME_REGEX = "^[A-Za-z]+$";
    private static final String FULL_NAME_REGEX = "^[A-Za-z]+(\\s[A-Za-z]+)*$";
    private static final String PHONE_REGEX = "^[0-9]{10}$";



    public PersonService(KeycloakProvider keycloakProvider, PersonTypeMasterRepository personTypeMasterRepository,
                         PersonMasterRepository personMasterRepository,
                         PersonSchemeMappingRepository personSchemeMappingRepository, SchemeMasterRepository schemeMasterRepository,
                         KeycloakClient keycloakClient, InviteTokenRepository inviteTokenRepository, MailService mailService) {
        this.keycloakProvider = keycloakProvider;
        this.personTypeMasterRepository = personTypeMasterRepository;
        this.personMasterRepository = personMasterRepository;
        this.personSchemeMappingRepository = personSchemeMappingRepository;
        this.schemeMasterRepository = schemeMasterRepository;
        this.inviteTokenRepository = inviteTokenRepository;
        this.keycloakClient = keycloakClient;
        this.mailService = mailService;
    }

    @Transactional
    public String inviteUser(InviteRequest inviteRequest) {

        if (inviteRequest.getSenderId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Sender ID is required"
            );
        }

        PersonMaster sender = personMasterRepository
                .findById(inviteRequest.getSenderId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Sender does not exist"
                ));

        if (sender.getPersonType() == null ||
                sender.getPersonType().getCName() == null ||
                !sender.getPersonType().getCName().equalsIgnoreCase("super_user")) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only super user can send invitations"
            );
        }

        if (personMasterRepository.findByEmail(inviteRequest.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Invitation already sent to this user"
            );
        }

        PersonMaster person = PersonMaster.builder()
                .email(inviteRequest.getEmail())
                .build();
        personMasterRepository.save(person);

        String token = UUID.randomUUID().toString();
        InviteToken inviteToken = InviteToken.builder()
                .email(inviteRequest.getEmail())
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .senderId(inviteRequest.getSenderId())
                .used(false)
                .build();
        inviteTokenRepository.save(inviteToken);

        String inviteLink = frontendBaseUrl + "?token=" + token;

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                try {
                    mailService.sendInviteMail(inviteRequest.getEmail(), inviteLink);
                } catch (Exception e) {
                    log.error("Failed to send invite email to {}", inviteRequest.getEmail(), e);
                }
            }
        });
        return token;
    }


    @Transactional
    public void completeProfile(RegisterRequest registerRequest) {

        InviteToken inviteToken = inviteTokenRepository.findByToken(registerRequest.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid invite token"));

        if (!inviteToken.getEmail().equalsIgnoreCase(registerRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token does not belong to this user");
        }

        if (inviteToken.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invite token has already been used");
        }

        if (inviteToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invite token has expired");
        }

        PersonMaster person = personMasterRepository.findByEmail(inviteToken.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found for this invite"));

        if (person.isProfileCompleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profile has already been completed");
        }

        if (personMasterRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Phone number already exists");
        }

        PersonTypeMaster personType = personTypeMasterRepository.findBycName(registerRequest.getPersonType())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid person type"));

        UsersResource usersResource = keycloakProvider.getAdminInstance()
                .realm(realm)
                .users();

        UserRepresentation keycloakUser = new UserRepresentation();
        keycloakUser.setUsername(registerRequest.getPhoneNumber());
        keycloakUser.setEmail(person.getEmail());
        keycloakUser.setFirstName(registerRequest.getFirstName());
        keycloakUser.setLastName(registerRequest.getLastName());
        keycloakUser.setEnabled(true);
        keycloakUser.setEmailVerified(true);
        keycloakUser.setRequiredActions(List.of("UPDATE_PASSWORD"));

        String keycloakUserId;
        try (Response response = usersResource.create(keycloakUser)) {

            if (response.getStatus() != Response.Status.CREATED.getStatusCode()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Failed to create user in Keycloak"
                );
            }

            keycloakUserId = response.getLocation().getPath().replaceAll(".*/", "");
        }

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(registerRequest.getPassword());
        credential.setTemporary(false);
        usersResource.get(keycloakUserId).resetPassword(credential);

        try {
            person.setFirstName(registerRequest.getFirstName());
            person.setLastName(registerRequest.getLastName());
            person.setFullName(registerRequest.getFirstName() + " " + registerRequest.getLastName());
            person.setPhoneNumber(registerRequest.getPhoneNumber());
            person.setPersonType(personType);
            person.setKeycloakUserId(keycloakUserId);
            person.setTenantId(registerRequest.getTenantId());
            person.setProfileCompleted(true);

            personMasterRepository.save(person);

            try {
                assignRoleToUser(keycloakUserId, "STATE_ADMIN");
            } catch (Exception e) {
                log.error("Failed to assign role to user: {}", e.getMessage(), e);
            }

            inviteToken.setUsed(true);
            inviteTokenRepository.save(inviteToken);

            log.info("Profile completed successfully for user: {}", person.getEmail());

        } catch (Exception e) {
            log.error("Failed to complete profile, deleting Keycloak user to avoid orphaned account", e);
            try {
                usersResource.delete(keycloakUserId);
            } catch (Exception kcEx) {
                log.error("Failed to delete Keycloak user {} after DB failure", keycloakUserId, kcEx);
            }
            throw e;
        }
    }

    public TokenResponse login(LoginRequest loginRequest) {
        Map<String, Object> tokenMap = keycloakClient.obtainToken(
                loginRequest.getUsername(), loginRequest.getPassword()
        );

        PersonMaster person = personMasterRepository.findByPhoneNumber(loginRequest.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "User not found with this phone number"
                ));

        log.debug("User '{}' logged in with tenant '{}'", person.getPhoneNumber(), person.getTenantId());

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken((String) tokenMap.get("access_token"));
        tokenResponse.setRefreshToken((String) tokenMap.get("refresh_token"));
        tokenResponse.setExpiresIn(tokenMap.get("expires_in") instanceof Number ? ((Number) tokenMap.get("expires_in")).intValue() : 0);
        tokenResponse.setRefreshExpiresIn(tokenMap.get("refresh_expires_in") instanceof Number ? ((Number) tokenMap.get("refresh_expires_in")).intValue() : 0);
        tokenResponse.setTokenType((String) tokenMap.get("token_type"));
        tokenResponse.setIdToken((String) tokenMap.get("id_token"));
        tokenResponse.setSessionState((String) tokenMap.get("session_state"));
        tokenResponse.setScope((String) tokenMap.get("scope"));

        tokenResponse.setPersonId(person.getId());
        tokenResponse.setTenantId(person.getTenantId());
        tokenResponse.setRole(person.getPersonType() != null ? person.getPersonType().getCName() : null);

        return tokenResponse;
    }


    public TokenResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token must be provided");
        }

        Map<String, Object> tokenMap;
        try {
            tokenMap = keycloakClient.refreshToken(refreshToken);
        } catch (Exception e) {
            log.error("Failed to refresh token", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token");
        }

        String accessToken = (String) tokenMap.get("access_token");
        Map<String, Object> userInfo = keycloakClient.getUserInfo(accessToken);

        String username = (String) userInfo.get("preferred_username");
        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to extract username from token");
        }

        PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

        log.debug("User '{}' refreshed token with tenant '{}'", person.getPhoneNumber(), person.getTenantId());

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken(accessToken);
        tokenResponse.setRefreshToken((String) tokenMap.get("refresh_token"));

        tokenResponse.setExpiresIn(tokenMap.get("expires_in") instanceof Number ? ((Number) tokenMap.get("expires_in")).intValue() : 0);
        tokenResponse.setRefreshExpiresIn(tokenMap.get("refresh_expires_in") instanceof Number ? ((Number) tokenMap.get("refresh_expires_in")).intValue() : 0);
        tokenResponse.setTokenType((String) tokenMap.get("token_type"));
        tokenResponse.setIdToken((String) tokenMap.get("id_token"));
        tokenResponse.setSessionState((String) tokenMap.get("session_state"));
        tokenResponse.setScope((String) tokenMap.get("scope"));
        tokenResponse.setPersonId(person.getId());
        tokenResponse.setTenantId(person.getTenantId());
        tokenResponse.setRole(person.getPersonType() != null ? person.getPersonType().getCName() : null);

        return tokenResponse;
    }

    public boolean logout(String refreshToken) {
        return keycloakClient.logout(refreshToken);
    }

    private void assignRoleToUser(String userId, String roleName){
        RealmResource realmResource =
                keycloakProvider.getAdminInstance()
                        .realm(realm);

        RoleRepresentation role =
                realmResource.roles().get(roleName).toRepresentation();

        realmResource
                .users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(List.of(role));

        log.debug("Assigned role '{}' to Keycloak user with id '{}'", roleName, userId);
    }

    @Transactional
    public Map<String, Object> bulkInviteUsers(MultipartFile file, String tenantId) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new BadRequestException("File name is missing");
        }

        List<Map<String, String>> errors = new ArrayList<>();
        List<PersonMaster> personsToSave = new ArrayList<>();
        List<PersonSchemeMapping> mappingsToSave = new ArrayList<>();
        Set<String> phoneNumbers = new HashSet<>();

        String[] EXPECTED_HEADERS = {
                "first_name",
                "last_name",
                "full_name",
                "phone_number",
                "alternate_number",
                "person_type_id",
                "state_scheme_id",
                "center_scheme_id"
        };

        try (InputStream is = file.getInputStream()) {

            if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                try (Workbook workbook = filename.endsWith(".xlsx") ? new XSSFWorkbook(is) : new HSSFWorkbook(is)) {
                    Sheet sheet = workbook.getSheetAt(0);

                    Row headerRow = sheet.getRow(0);
                    if (headerRow == null) {
                        throw new com.jalsoochak.ManagementService.exceptions.BadRequestException("Header row is missing");
                    }

                    for (int i = 0; i < EXPECTED_HEADERS.length; i++) {
                        String cellValue = getCellValue(headerRow.getCell(i)).toLowerCase().trim();
                        if (!EXPECTED_HEADERS[i].equals(cellValue)) {
                            throw new com.jalsoochak.ManagementService.exceptions.BadRequestException("Invalid header at column " + (i + 1)
                                    + ": expected '" + EXPECTED_HEADERS[i] + "', found '" + cellValue + "'");
                        }
                    }

                    for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                        Row row = sheet.getRow(i);
                        if (row == null) continue;

                        String[] cells = new String[8];
                        for (int c = 0; c < 8; c++) {
                            cells[c] = getCellValue(row.getCell(c));
                        }

                        processRow(cells, i + 1, tenantId, phoneNumbers, personsToSave, mappingsToSave, errors);
                    }
                }
            } else if (filename.endsWith(".csv")) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                     CSVReader csvReader = new CSVReader(reader)) {

                    String[] headerRow = csvReader.readNext();
                    if (headerRow == null) {
                        throw new com.jalsoochak.ManagementService.exceptions.BadRequestException("CSV file is empty or missing header row");
                    }

                    for (int i = 0; i < EXPECTED_HEADERS.length; i++) {
                        String cellValue = i < headerRow.length ? headerRow[i].toLowerCase().trim() : "";
                        if (!EXPECTED_HEADERS[i].equals(cellValue)) {
                            throw new com.jalsoochak.ManagementService.exceptions.BadRequestException("Invalid CSV header at column " + (i + 1)
                                    + ": expected '" + EXPECTED_HEADERS[i] + "', found '" + cellValue + "'");
                        }
                    }

                    String[] cells;
                    int rowNum = 1;
                    while ((cells = csvReader.readNext()) != null) {
                        rowNum++;

                        String[] paddedCells = new String[8];
                        for (int i = 0; i < 8; i++) {
                            if (i < cells.length) {
                                paddedCells[i] = cells[i] != null ? cells[i].trim() : "";
                            } else {
                                paddedCells[i] = "";
                            }
                        }

                        processRow(paddedCells, rowNum, tenantId, phoneNumbers, personsToSave, mappingsToSave, errors);
                    }
                } catch (CsvValidationException e) {
                    throw new BadRequestException("Invalid CSV format: " + e.getMessage());
                }
            } else {
                throw new BadRequestException("Unsupported file type: " + filename);
            }

            if (!errors.isEmpty()) {
                throw new com.jalsoochak.ManagementService.exceptions.BadRequestException("Validation failed", errors);
            }

            personMasterRepository.saveAll(personsToSave);
            personSchemeMappingRepository.saveAll(mappingsToSave);

            return Map.of(
                    "message", "Onboarding Successful",
                    "count", personsToSave.size()
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to read file", e);
        }
    }


    private void processRow(String[] cells, int rowNum, String tenantId,
                            Set<String> phoneNumbers,
                            List<PersonMaster> personsToSave,
                            List<PersonSchemeMapping> mappingsToSave,
                            List<Map<String, String>> errors) {

        String firstName = cells[0];
        String lastName = cells[1];
        String fullName = cells[2];
        String phoneNumber = cells[3];
        String alternateNumber = cells[4];
        String personTypeTitle = cells[5];
        String stateSchemeIdStr = cells[6];
        String centerSchemeIdStr = cells[7];

        Map<String, String> rowErrors = new HashMap<>();

        if (firstName == null || firstName.isBlank()) {
            rowErrors.put("first_name", "First name is required");
        } else if (!firstName.matches(NAME_REGEX)) {
            rowErrors.put("first_name", "First name must contain only letters");
        }

        if (lastName == null || lastName.isBlank()) {
            rowErrors.put("last_name", "Last name is required");
        } else if (!lastName.matches(NAME_REGEX)) {
            rowErrors.put("last_name", "Last name must contain only letters");
        }

        if (fullName == null || fullName.isBlank()) {
            rowErrors.put("full_name", "Full name is required");
        } else if (!fullName.matches(FULL_NAME_REGEX)) {
            rowErrors.put("full_name", "Full name must contain only letters and spaces");
        }

        if (phoneNumber == null || phoneNumber.isBlank()) {
            rowErrors.put("phone_number", "Phone number is required");
        } else if (!phoneNumber.matches(PHONE_REGEX)) {
            rowErrors.put("phone_number", "Phone number must be exactly 10 digits");
        } else {
            if (!phoneNumbers.add(phoneNumber)) {
                rowErrors.put("phone_number", "Duplicate phone number in file");
            }
            if (personMasterRepository.existsByPhoneNumberAndTenantId(phoneNumber, tenantId)) {
                rowErrors.put("phone_number", "Phone number already exists in system");
            }
        }


        if (personTypeTitle == null || personTypeTitle.isBlank())
            rowErrors.put("person_type", "person_type is required");
        else if (!ALLOWED_PERSON_TYPE.equalsIgnoreCase(personTypeTitle.trim()))
            rowErrors.put("person_type", "person_type must be 'Pump Operator'");

        if (stateSchemeIdStr == null || stateSchemeIdStr.isBlank())
            rowErrors.put("state_scheme_id", "State scheme id is required");
        if (centerSchemeIdStr == null || centerSchemeIdStr.isBlank())
            rowErrors.put("center_scheme_id", "Center scheme id is required");

        if (!rowErrors.isEmpty()) {
            rowErrors.put("row", String.valueOf(rowNum));
            errors.add(rowErrors);
            return;
        }

        PersonTypeMaster personType = personTypeMasterRepository.findByTitle(ALLOWED_PERSON_TYPE).orElse(null);
        if (personType == null) {
            rowErrors.put("person_type", "'Pump Operator' not configured in system");
            rowErrors.put("row", String.valueOf(rowNum));
            errors.add(rowErrors);
            return;
        }

        PersonMaster person = PersonMaster.builder()
                .firstName(firstName)
                .lastName(lastName)
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .alternateNumber(alternateNumber)
                .tenantId(tenantId)
                .personType(personType)
                .build();
        personsToSave.add(person);

        if (stateSchemeIdStr != null && !stateSchemeIdStr.isBlank()) {
            try {
                Long stateSchemeId = Long.parseLong(stateSchemeIdStr);
                SchemeMaster stateScheme = schemeMasterRepository.findById(stateSchemeId)
                        .orElseThrow(() -> new BadRequestException("Invalid state scheme at row " + rowNum));

                mappingsToSave.add(
                        PersonSchemeMapping.builder()
                                .person(person)
                                .scheme(stateScheme)
                                .build()
                );
            } catch (NumberFormatException e) {
                rowErrors.put("state_scheme_id", "State scheme must be a number");
                rowErrors.put("row", String.valueOf(rowNum));
                errors.add(rowErrors);
            }
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();

            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return new DataFormatter().formatCellValue(cell).trim();
                } else {
                    return new BigDecimal(cell.getNumericCellValue())
                            .toPlainString()
                            .replaceAll("\\.0$", "");
                }

            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue()).trim();

            case FORMULA:
                return new DataFormatter().formatCellValue(cell).trim();

            case BLANK:
            default:
                return "";
        }
    }

}