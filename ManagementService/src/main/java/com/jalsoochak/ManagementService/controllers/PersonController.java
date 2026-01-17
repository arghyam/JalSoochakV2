package com.jalsoochak.ManagementService.controllers;

import com.jalsoochak.ManagementService.models.app.request.InviteRequest;
import com.jalsoochak.ManagementService.models.app.request.LoginRequest;
import com.jalsoochak.ManagementService.models.app.request.RegisterRequest;
import com.jalsoochak.ManagementService.models.app.request.TokenRequest;
import com.jalsoochak.ManagementService.models.app.response.TokenResponse;
import com.jalsoochak.ManagementService.services.impl.PersonService;
import jakarta.ws.rs.BadRequestException;
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

@RestController
@RequestMapping("/api/v2/auth")
@RequiredArgsConstructor
@Slf4j
public class PersonController {
    private final PersonService personService;

    @PostMapping("/invite/user")
    public ResponseEntity<?> inviteUser(@RequestBody InviteRequest inviteRequest,
                                        @RequestHeader("Authorization") String authHeader){

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authorization token is empty");
        }

        if(!personService.isSuperAdmin(token)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only super admin can invite user");
        }

        personService.inviteUser(inviteRequest);
        return ResponseEntity.ok("Invitation sent");
    }

    @PostMapping("/complete/profile")
    public ResponseEntity<?> completeProfile(
            @RequestBody RegisterRequest registerRequest,
            @RequestHeader("Authorization") String authHeader) {

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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getReason());

        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenResponse response = personService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody TokenRequest tokenRequest) {
        if (tokenRequest.getRefreshToken() == null || tokenRequest.getRefreshToken().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
        TokenResponse response = personService.refreshToken(tokenRequest.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam String refreshToken) {
        boolean success = personService.logout(refreshToken);
        return success ? ResponseEntity.ok("Logged out") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Logout failed");
    }

}
