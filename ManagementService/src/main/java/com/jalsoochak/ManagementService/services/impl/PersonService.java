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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.Map;

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
    private final KeycloakClient keycloakClient;

    private static final String SUPER_ADMIN_ROLE = "super_user";

    public PersonService(KeycloakProvider keycloakProvider, PersonTypeMasterRepository personTypeMasterRepository,
                         PersonMasterRepository personMasterRepository, TenantMasterRepository tenantMasterRepository, KeycloakClient keycloakClient) {
        this.keycloakProvider = keycloakProvider;
        this.personTypeMasterRepository = personTypeMasterRepository;
        this.personMasterRepository = personMasterRepository;
        this.tenantMasterRepository = tenantMasterRepository;
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
        user.setEmailVerified(false);
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

            log.info("Keycloak create user response: status={}, body={}", status, responseBody);

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
            log.info("user info: {}", userInfo);
            String username = (String) userInfo.get("preferred_username");
            log.info("userName: {}", username);
            if (username == null || username.isBlank()) {
                log.warn("preferred_username claim is missing or empty");
                return false;
            }

            PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            log.info("person: {}", person);

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

}