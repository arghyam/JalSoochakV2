package com.jalsoochak.ManagementService.services.impl;

import com.jalsoochak.ManagementService.config.KeycloakProvider;
import com.jalsoochak.ManagementService.models.app.request.InviteRequest;
import com.jalsoochak.ManagementService.models.app.request.LoginRequest;
import com.jalsoochak.ManagementService.models.app.request.RegisterRequest;
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
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import jakarta.ws.rs.core.Response;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

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

    private static final String SUPER_ADMIN_ROLE = "super_admin";

    public PersonService(KeycloakProvider keycloakProvider, PersonTypeMasterRepository personTypeMasterRepository,
                         PersonMasterRepository personMasterRepository, TenantMasterRepository tenantMasterRepository) {
        this.keycloakProvider = keycloakProvider;
        this.personTypeMasterRepository = personTypeMasterRepository;
        this.personMasterRepository = personMasterRepository;
        this.tenantMasterRepository = tenantMasterRepository;
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

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        try {
            String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("username", loginRequest.getUsername());
            requestBody.add("password", loginRequest.getPassword());
            requestBody.add("grant_type", "password");
            requestBody.add("scope", "openid");

            HttpEntity<MultiValueMap<String, String>> requestEntity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    tokenUrl,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {

                PersonMaster person = personMasterRepository.findByPhoneNumber(loginRequest.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found in person_master"));

                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> tokenResponse = objectMapper.readValue(
                        response.getBody(), Map.class
                );

                tokenResponse.put("tenant_id", person.getTenantId());
                tokenResponse.put("person_type", person.getPersonType().getCName());

                return ResponseEntity.ok(tokenResponse);
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("Login failed: " + response.getBody());
            }

        } catch (Exception e) {
            log.error("Login error: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials or server error");
        }
    }

    public ResponseEntity<?> refreshToken(String refreshToken) {
        try {
            String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("refresh_token", refreshToken);
            requestBody.add("grant_type", "refresh_token");

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> tokenResponse = objectMapper.readValue(response.getBody(), Map.class);

                String accessToken = (String) tokenResponse.get("access_token");

                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getPublicKey())
                        .build()
                        .parseClaimsJws(accessToken)
                        .getBody();

                String username = claims.get("preferred_username", String.class);
                PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new RuntimeException("User not found in person_master"));

                tokenResponse.put("tenant_id", person.getTenantId());
                tokenResponse.put("person_type", person.getPersonType().getCName());

                return ResponseEntity.ok(tokenResponse);
            }

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            log.error("Token refresh error: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token refresh failed");
        }
    }

    public ResponseEntity<?> logout(String refreshToken) {
        try {
            String logoutUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> requestEntity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    logoutUrl,
                    requestEntity,
                    String.class
            );

            return ResponseEntity.status(response.getStatusCode()).body("Logged out successfully");

        } catch (Exception e) {
            log.error("Logout error: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Logout failed");
        }
    }

    public RSAPublicKey getPublicKey() throws Exception {
        return (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyPem)));
    }

    public boolean isSuperAdmin(String token) {
        try {
            String userInfoUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/userinfo";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    userInfoUrl,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            log.debug("Userinfo response status: {}", response.getStatusCode());

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> userInfo = response.getBody();
                if (userInfo == null) {
                    log.warn("Userinfo response body is null");
                    return false;
                }

                String username = (String) userInfo.get("preferred_username");
                if (username == null || username.isBlank()) {
                    log.warn("preferred_username claim is missing or empty");
                    return false;
                }

                PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new RuntimeException("User not found in person_master"));

                return person.getPersonType() != null
                        && SUPER_ADMIN_ROLE.equals(person.getPersonType().getCName());
            }

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.debug("Token validation failed: {}", e.getStatusCode());
        } catch (RuntimeException e) {
            log.debug("Expected error verifying super admin: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error verifying super admin", e);
        }

        return false;
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