package com.jalsoochak.ManagementService.services.service;

import com.jalsoochak.ManagementService.config.KeycloakProvider;
import com.jalsoochak.ManagementService.models.app.request.LoginRequest;
import com.jalsoochak.ManagementService.models.app.request.RegisterRequest;
import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.entity.PersonTypeMaster;
import com.jalsoochak.ManagementService.models.entity.TenantMaster;
import com.jalsoochak.ManagementService.repositories.PersonMasterRepository;
import com.jalsoochak.ManagementService.repositories.PersonTypeMasterRepository;
import com.jalsoochak.ManagementService.repositories.TenantMasterRepository;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
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


import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class KeycloakAdminClientService {
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

    private final RestTemplate restTemplate;

    private final KeycloakProvider keycloakProvider;
    private final PersonTypeMasterRepository personTypeMasterRepository;
    private final PersonMasterRepository personMasterRepository;
    private final TenantMasterRepository tenantMasterRepository;

    private static final String SUPER_ADMIN_ROLE = "super_admin";

    public KeycloakAdminClientService(KeycloakProvider keycloakProvider, PersonTypeMasterRepository personTypeMasterRepository,
                                      PersonMasterRepository personMasterRepository, TenantMasterRepository tenantMasterRepository) {
        this.keycloakProvider = keycloakProvider;
        this.personTypeMasterRepository = personTypeMasterRepository;
        this.personMasterRepository = personMasterRepository;
        this.tenantMasterRepository = tenantMasterRepository;
        this.restTemplate = new RestTemplate();
    }

    public Response createKeycloakUser(RegisterRequest user) {
        UsersResource usersResource = keycloakProvider.getAdminInstance()
                .realm(realm)
                .users();

        if (personMasterRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Phone number already exists: " + user.getPhoneNumber());
        }

        TenantMaster tenant = tenantMasterRepository.findByTenantName(user.getTenantId().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid tenant_id: " + user.getTenantId()));

        CredentialRepresentation credentialRepresentation = createPasswordCredentials(user.getPassword());

        UserRepresentation keycloakUser = new UserRepresentation();
        keycloakUser.setUsername(user.getPhoneNumber());
        keycloakUser.setCredentials(Collections.singletonList(credentialRepresentation));
        keycloakUser.setFirstName(user.getFirstName());
        keycloakUser.setLastName(user.getLastName());
        keycloakUser.setEmail(user.getEmail());
        keycloakUser.setEnabled(true);
        keycloakUser.setEmailVerified(false);

        Response response = usersResource.create(keycloakUser);
        log.info("Keycloak create user response status: {}", response);
        if (response.getStatus() == 201) {
            PersonTypeMaster personType = personTypeMasterRepository.findBycName(user.getPersonType())
                    .orElseThrow(() -> new RuntimeException("PersonType not found: " + user.getPersonType()));

            log.info("TenantId: {}", user.getTenantId());
            PersonMaster person = PersonMaster.builder()
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .fullName(user.getFirstName() + " " + user.getLastName())
                    .phoneNumber(user.getPhoneNumber())
                    .personType(personType)
                    .tenantId(tenant.getTenantName())
                    .createdBy("system")
                    .build();
            log.info("Person: {}", person);
            personMasterRepository.save(person);
        }
        return response;
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

            HttpEntity<MultiValueMap<String, String>> requestEntity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    tokenUrl,
                    requestEntity,
                    String.class
            );

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            log.error("Token refresh error: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token refresh failed");
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

    private static CredentialRepresentation createPasswordCredentials(String password) {
        CredentialRepresentation passwordCredentials = new CredentialRepresentation();
        passwordCredentials.setTemporary(false);
        passwordCredentials.setType(CredentialRepresentation.PASSWORD);
        passwordCredentials.setValue(password);
        return passwordCredentials;
    }

    public boolean isSuperAdmin(String token) {
        try {
            String userInfoUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/userinfo";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    userInfoUrl,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    Map.class
            );
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> userInfo = response.getBody();
                String username = (String) userInfo.get("preferred_username");

                PersonMaster person = personMasterRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                return SUPER_ADMIN_ROLE.equals(person.getPersonType().getCName());
            }
        } catch (Exception e) {
            log.error("Error verifying super admin", e);
        }
        return false;
    }

}
