package com.jalsoochak.ManagementService.services.impl;

import com.jalsoochak.ManagementService.clients.KeycloakClient;
import com.jalsoochak.ManagementService.config.KeycloakProvider;
import com.jalsoochak.ManagementService.models.app.request.InviteRequest;
import com.jalsoochak.ManagementService.models.app.request.LoginRequest;
import com.jalsoochak.ManagementService.models.app.request.RegisterRequest;
import com.jalsoochak.ManagementService.models.app.response.TokenResponse;
import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.entity.PersonTypeMaster;
import com.jalsoochak.ManagementService.models.entity.TenantMaster;
import com.jalsoochak.ManagementService.models.enums.KeycloakRole;
import com.jalsoochak.ManagementService.repositories.PersonMasterRepository;
import com.jalsoochak.ManagementService.repositories.PersonTypeMasterRepository;
import com.jalsoochak.ManagementService.repositories.TenantMasterRepository;
import jakarta.ws.rs.BadRequestException;
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
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    private final RestTemplate restTemplate;

    private final KeycloakProvider keycloakProvider;
    private final PersonTypeMasterRepository personTypeMasterRepository;
    private final PersonMasterRepository personMasterRepository;
    private final TenantMasterRepository tenantMasterRepository;
    private final KeycloakClient keycloakClient;

    private static final String SUPER_ADMIN_ROLE = "super_admin";

    public PersonService(KeycloakProvider keycloakProvider, PersonTypeMasterRepository personTypeMasterRepository,
                         PersonMasterRepository personMasterRepository, TenantMasterRepository tenantMasterRepository, KeycloakClient keycloakClient) {
        this.keycloakProvider = keycloakProvider;
        this.personTypeMasterRepository = personTypeMasterRepository;
        this.personMasterRepository = personMasterRepository;
        this.tenantMasterRepository = tenantMasterRepository;
        this.keycloakClient = keycloakClient;
        this.restTemplate = new RestTemplate();
    }

    public void inviteUser(InviteRequest inviteRequest){

        Optional<PersonMaster> personMaster = personMasterRepository
                .findByEmail(inviteRequest.getEmail());

        if (personMaster.isPresent()){
            throw new BadRequestException("Invitation already sent to this user");
        }

        UsersResource users = keycloakProvider.getAdminInstance()
                .realm(realm)
                .users();

        UserRepresentation user = new UserRepresentation();
        user.setEmail(inviteRequest.getEmail());
        user.setEnabled(true);
        user.setEmailVerified(false);

        user.setRequiredActions(List.of(
                "UPDATE_PASSWORD",
                "VERIFY_EMAIL"
        ));

        Response response = users.create(user);
        log.info("Keycloak create user response status: {}", response);

        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create new user");
        }

        String userId = response.getLocation().getPath()
                .replaceAll(".*/", "");


        users.get(userId).executeActionsEmail(List.of("UPDATE_PASSWORD", "VERIFY_EMAIL"));

        PersonMaster person = PersonMaster.builder()
                .email(inviteRequest.getEmail())
                .build();

        personMasterRepository.save(person);
    }

    public void completeProfile(RegisterRequest registerRequest,
                                 String token) throws VerificationException {
        String email = extractEmailFromToken(token);

        PersonMaster person = personMasterRepository
                .findByEmail(email).orElseThrow(() -> new BadRequestException("User with email not found"));

        if (person.isProfileCompleted()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Profile already completed"
            );
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
        assignRoleToUser(userId, KeycloakRole.STATE_ADMIN.getRoleName());
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
        tokenResponse.setExpiresIn((Integer) tokenMap.get("expires_in"));
        tokenResponse.setRefreshExpiresIn((Integer) tokenMap.get("refresh_expires_in"));
        tokenResponse.setTokenType((String) tokenMap.get("token_type"));
        tokenResponse.setIdToken((String) tokenMap.get("id_token"));
        tokenResponse.setSessionState((String) tokenMap.get("session_state"));
        tokenResponse.setScope((String) tokenMap.get("scope"));

        return tokenResponse;
    }

    public TokenResponse refreshToken(String refreshToken) {
        Map<String, Object> tokenMap = keycloakClient.refreshToken(refreshToken);

        String username = (String) tokenMap.get("preferred_username");
        PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.debug("User '{}' logged in with tenant '{}'", person.getPhoneNumber(), person.getTenantId());

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken((String) tokenMap.get("access_token"));
        tokenResponse.setRefreshToken((String) tokenMap.get("refresh_token"));
        tokenResponse.setExpiresIn((Integer) tokenMap.get("expires_in"));
        tokenResponse.setRefreshExpiresIn((Integer) tokenMap.get("refresh_expires_in"));
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
        AccessToken accessToken = TokenVerifier.create(token, AccessToken.class)
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

}