package com.jalsoochak.ManagementService.services.impl;

import com.jalsoochak.ManagementService.clients.KeycloakClient;
import com.jalsoochak.ManagementService.config.KeycloakProvider;
import com.jalsoochak.ManagementService.models.app.request.InviteRequest;
import com.jalsoochak.ManagementService.models.app.request.LoginRequest;
import com.jalsoochak.ManagementService.models.app.request.RegisterRequest;
import com.jalsoochak.ManagementService.models.app.response.TokenResponse;
import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.entity.PersonSchemeMapping;
import com.jalsoochak.ManagementService.models.entity.PersonTypeMaster;
import com.jalsoochak.ManagementService.models.entity.SchemeMaster;
import com.jalsoochak.ManagementService.models.entity.TenantMaster;
import com.jalsoochak.ManagementService.models.enums.KeycloakRole;
import com.jalsoochak.ManagementService.repositories.PersonMasterRepository;
import com.jalsoochak.ManagementService.repositories.PersonSchemeMappingRepository;
import com.jalsoochak.ManagementService.repositories.PersonTypeMasterRepository;
import com.jalsoochak.ManagementService.repositories.SchemeMasterRepository;
import com.jalsoochak.ManagementService.repositories.TenantMasterRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.ws.rs.BadRequestException;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.keycloak.TokenVerifier;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.common.VerificationException;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.idm.RoleRepresentation;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import jakarta.ws.rs.core.Response;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.HttpClientErrorException.BadRequest;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class PersonService {
    @Value("${keycloak.realm}")
    public String realm;

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    @Value("${keycloak.admin-client-id}")
    private String adminClientId;

    @Value("${keycloak.admin-client-secret}")
    private String adminClientSecret;

    @Value("${keycloak.public-key}")
    private String publicKeyPem;

    private final KeycloakProvider keycloakProvider;
    private final PersonTypeMasterRepository personTypeMasterRepository;
    private final PersonMasterRepository personMasterRepository;
    private final TenantMasterRepository tenantMasterRepository;
    private final PersonSchemeMappingRepository personSchemeMappingRepository;
    private final SchemeMasterRepository schemeMasterRepository;
    private final KeycloakClient keycloakClient;
    private static final String ALLOWED_PERSON_TYPE = "Pump Operator";


    private static final String SUPER_ADMIN_ROLE = "super_user";

    private static final String NAME_REGEX = "^[A-Za-z]+$";
    private static final String FULL_NAME_REGEX = "^[A-Za-z]+(\\s[A-Za-z]+)*$";
    private static final String PHONE_REGEX = "^[0-9]{10}$";



    public PersonService(KeycloakProvider keycloakProvider, PersonTypeMasterRepository personTypeMasterRepository,
                         PersonMasterRepository personMasterRepository, TenantMasterRepository tenantMasterRepository, PersonSchemeMappingRepository personSchemeMappingRepository, SchemeMasterRepository schemeMasterRepository, KeycloakClient keycloakClient) {
        this.keycloakProvider = keycloakProvider;
        this.personTypeMasterRepository = personTypeMasterRepository;
        this.personMasterRepository = personMasterRepository;
        this.tenantMasterRepository = tenantMasterRepository;
        this.personSchemeMappingRepository = personSchemeMappingRepository;
        this.schemeMasterRepository = schemeMasterRepository;
        this.keycloakClient = keycloakClient;
    }

    public void inviteUser(InviteRequest inviteRequest) {
        if (personMasterRepository.findByEmail(inviteRequest.getEmail()).isPresent()) {
            throw new BadRequestException("Invitation already sent to this user");
        }

        UsersResource users = keycloakProvider.getAdminInstance()
                .realm(realm)
                .users();

//        List<UserRepresentation> existingUsers = users.search(inviteRequest.getEmail());
//
//        log.info("existingUser: {}", existingUsers);
//
//        if (!existingUsers.isEmpty()) {
//            throw new BadRequestException("User already exists in Keycloak");
//        }

        UserRepresentation user = new UserRepresentation();
        user.setUsername(inviteRequest.getEmail());
        user.setEmail(inviteRequest.getEmail());
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setRequiredActions(List.of("UPDATE_PASSWORD", "VERIFY_EMAIL"));


        Response response = null;
        String responseBody = "";
        try {
            response = users.create(user);
            int status = response.getStatus();

            try {
                responseBody = response.readEntity(String.class);
            } catch (Exception e) {
                log.warn("Unable to read response body from Keycloak", e);
            }

            log.debug("Keycloak create user response: status={}, body={}", status, responseBody);

            if (status != 201) {
                throw new RuntimeException(
                        "Failed to create new user in Keycloak: status=" + status + ", body=" + responseBody
                );
            }

            String userId = response.getLocation().getPath().replaceAll(".*/", "");

            users.get(userId).executeActionsEmail(List.of("UPDATE_PASSWORD", "VERIFY_EMAIL"));

            PersonMaster person = PersonMaster.builder()
                    .email(inviteRequest.getEmail())
                    .build();

            personMasterRepository.save(person);

        } catch (RuntimeException e) {
            log.error("Error during user creation in Keycloak", e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during Keycloak user creation", e);
            throw new RuntimeException("Failed to invite user: " + e.getMessage(), e);
        } finally {
            if (response != null) {
                response.close();
            }
        }
    }

    @Transactional
    public void completeProfile(RegisterRequest registerRequest, String token) throws VerificationException {
        String email = extractEmailFromToken(token);

        PersonMaster person = personMasterRepository
                .findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User with email not found"));

        if (person.isProfileCompleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profile already completed");
        }

        if (personMasterRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Phone number already exists: " + registerRequest.getPhoneNumber());
        }

        TenantMaster tenant = tenantMasterRepository.findByTenantName(registerRequest.getTenantId().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid tenant_id: " + registerRequest.getTenantId()));

        PersonTypeMaster personType = personTypeMasterRepository
                .findBycName(registerRequest.getPersonType())
                .orElseThrow(() -> new BadRequestException("Invalid person type"));

        person.setFirstName(registerRequest.getFirstName());
        person.setLastName(registerRequest.getLastName());
        person.setFullName(registerRequest.getFirstName() + " " + registerRequest.getLastName());
        person.setPhoneNumber(registerRequest.getPhoneNumber());
        person.setPersonType(personType);
        person.setTenantId(tenant.getTenantName());
        person.setProfileCompleted(true);

        personMasterRepository.save(person);

        String userId = getKeycloakUserIdByEmail(email);
        try {
            assignRoleToUser(userId, KeycloakRole.STATE_ADMIN.getRoleName());
        } catch (Exception e) {
            log.error("Failed to assign Keycloak role, rolling back DB profile", e);
            throw new RuntimeException("Role assignment failed, profile update rolled back", e);
        }
    }

    public TokenResponse login(LoginRequest loginRequest) {
        Map<String, Object> tokenMap = keycloakClient.obtainToken(
                loginRequest.getUsername(), loginRequest.getPassword()
        );

        PersonMaster person = personMasterRepository.findByPhoneNumber(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.debug("User '{}' logged in with tenant '{}'", person.getPhoneNumber(), person.getTenantId());

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken((String) tokenMap.get("access_token"));
        tokenResponse.setRefreshToken((String) tokenMap.get("refresh_token"));

        tokenResponse.setExpiresIn(
                tokenMap.get("expires_in") instanceof Number
                        ? ((Number) tokenMap.get("expires_in")).intValue()
                        : 0
        );

        tokenResponse.setRefreshExpiresIn(
                tokenMap.get("refresh_expires_in") instanceof Number
                        ? ((Number) tokenMap.get("refresh_expires_in")).intValue()
                        : 0
        );

        tokenResponse.setTokenType((String) tokenMap.get("token_type"));
        tokenResponse.setIdToken((String) tokenMap.get("id_token"));
        tokenResponse.setSessionState((String) tokenMap.get("session_state"));
        tokenResponse.setScope((String) tokenMap.get("scope"));


        return tokenResponse;
    }

    public TokenResponse refreshToken(String refreshToken) {
        Map<String, Object> tokenMap = keycloakClient.refreshToken(refreshToken);

        String accessToken = (String) tokenMap.get("access_token");
        Map<String, Object> userInfo = keycloakClient.getUserInfo(accessToken);

        String username = (String) userInfo.get("preferred_username");
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Unable to extract username from token");
        }

        PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.debug("User '{}' logged in with tenant '{}'", person.getPhoneNumber(), person.getTenantId());

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken(accessToken);
        tokenResponse.setRefreshToken((String) tokenMap.get("refresh_token"));

        tokenResponse.setExpiresIn(
                tokenMap.get("expires_in") instanceof Number
                        ? ((Number) tokenMap.get("expires_in")).intValue()
                        : 0
        );

        tokenResponse.setRefreshExpiresIn(
                tokenMap.get("refresh_expires_in") instanceof Number
                        ? ((Number) tokenMap.get("refresh_expires_in")).intValue()
                        : 0
        );

        tokenResponse.setTokenType((String) tokenMap.get("token_type"));
        tokenResponse.setIdToken((String) tokenMap.get("id_token"));
        tokenResponse.setSessionState((String) tokenMap.get("session_state"));
        tokenResponse.setScope((String) tokenMap.get("scope"));


        return tokenResponse;
    }


    public boolean logout(String refreshToken) {
        return keycloakClient.logout(refreshToken);
    }

    public boolean isSuperAdmin(String accessToken) {
        try {
            Map<String, Object> userInfo = keycloakClient.getUserInfo(accessToken);
            String username = (String) userInfo.get("preferred_username");
            if (username == null || username.isBlank()) {
                log.warn("preferred_username claim is missing or empty");
                return false;
            }

            PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return person.getPersonType() != null
                    && SUPER_ADMIN_ROLE.equals(person.getPersonType().getCName());

        } catch (Exception e) {
            log.error("Error verifying super admin", e);
            return false;
        }
    }

    private String extractEmailFromToken(String token) throws VerificationException {
        String publicKeyPemClean = publicKeyPem
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] decoded = Base64.getDecoder().decode(publicKeyPemClean);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
        RSAPublicKey publicKey;
        try {
            KeyFactory kf = KeyFactory.getInstance("RSA");
            publicKey = (RSAPublicKey) kf.generatePublic(keySpec);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Keycloak public key", e);
        }

        AccessToken accessToken = TokenVerifier.create(token, AccessToken.class)
                .publicKey(publicKey)
                .withDefaultChecks()
                .verify()
                .getToken();

        return accessToken.getEmail();
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

    private String getKeycloakUserIdByEmail(String email) {
        UsersResource users = keycloakProvider.getAdminInstance()
                .realm(realm)
                .users();

        List<UserRepresentation> results = users.search(email, true);

        if (results.isEmpty()) {
            throw new RuntimeException("Keycloak user not found for email: " + email);
        }

        return results.get(0).getId();
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