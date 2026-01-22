package com.jalsoochak.ManagementService.controllers;

import com.jalsoochak.ManagementService.models.app.request.InviteRequest;
import com.jalsoochak.ManagementService.models.app.request.LoginRequest;
import com.jalsoochak.ManagementService.models.app.request.RegisterRequest;
import com.jalsoochak.ManagementService.models.app.request.TokenRequest;
import com.jalsoochak.ManagementService.models.app.response.TokenResponse;
import com.jalsoochak.ManagementService.services.impl.PersonService;
import com.jalsoochak.ManagementService.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.common.VerificationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/v2/auth", "/auth"})
@RequiredArgsConstructor
@Slf4j
public class PersonController {
    private final PersonService personService;

    @PostMapping("/invite/user")
    public ResponseEntity<?> inviteUser(
            @RequestBody InviteRequest inviteRequest,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7).trim();

        if (token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authorization token is empty");
        }

        if (!personService.isSuperAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only super admin can invite user");
        }

        personService.inviteUser(inviteRequest);
        return ResponseEntity.ok("Invitation sent");
    }

    @PostMapping("/complete/profile")
    public ResponseEntity<?> completeProfile(
            @RequestBody RegisterRequest registerRequest,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7).trim();

        if (token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authorization token is empty");
        }

        try {
            personService.completeProfile(registerRequest, token);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User registered successfully");

        } catch (VerificationException e) {
            log.warn("Token verification failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");

        } catch (ResponseStatusException e) {
            log.warn("Business validation error: {}", e.getReason());
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getReason());

        } catch (BadRequestException e) {
            log.warn("Bad request while completing profile", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request data");

        } catch (Exception e) {
            log.error("Unexpected error while completing profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            TokenResponse response = personService.login(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.warn("Login failed due to invalid credentials or input", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid username or password"));

        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred. Please try again later."));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody TokenRequest tokenRequest) {
        if (tokenRequest.getRefreshToken() == null || tokenRequest.getRefreshToken().isBlank()) {
            log.warn("Refresh token is missing or blank");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Refresh token must be provided"));
        }

        try {
            TokenResponse response = personService.refreshToken(tokenRequest.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (BadRequestException e) {
            log.warn("Invalid refresh token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid refresh token"));
        } catch (Exception e) {
            log.error("Unexpected error during token refresh", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred. Please try again later."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam String refreshToken) {
        boolean success = personService.logout(refreshToken);
        return success ? ResponseEntity.ok("Logged out") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Logout failed");
    }


    @PostMapping("/bulk/invite")
    public ResponseEntity<?> bulkInvite(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing or invalid Authorization header"));
        }

        try {
            Map<String, Object> result = personService.bulkInviteUsers(file, tenantId);
            return ResponseEntity.ok(result);

        } catch (BadRequestException e) {
            log.warn("BadRequestException in bulkInvite: {}", e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());

            if (e.getErrors() != null) {
                response.put("errors", e.getErrors());
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(response);
        } catch (Exception e) {
            log.error("Error in bulkInvite", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred. Please contact support."));
        }
    }

}
