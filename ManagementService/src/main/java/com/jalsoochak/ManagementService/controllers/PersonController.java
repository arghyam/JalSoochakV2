package com.jalsoochak.ManagementService.controllers;

import com.jalsoochak.ManagementService.models.app.request.*;
import com.jalsoochak.ManagementService.models.app.response.InviteToken;
import com.jalsoochak.ManagementService.models.app.response.TokenResponse;
import com.jalsoochak.ManagementService.services.impl.PersonService;
import com.jalsoochak.ManagementService.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public ResponseEntity<InviteToken> inviteUser(
            @RequestBody InviteRequest inviteRequest,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Missing or invalid Authorization header"
            );
        }

        String token = authHeader.substring(7).trim();

        if (token.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authorization token is empty"
            );
        }

        if (!personService.isSuperAdmin(token)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only super admin can invite user"
            );
        }

        String inviteToken = personService.inviteUser(inviteRequest);
        return ResponseEntity.ok(new InviteToken(inviteToken));
    }

    @PostMapping("/complete/profile")
    public ResponseEntity<String> completeProfile(
            @RequestBody RegisterRequest registerRequest) {

        personService.completeProfile(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenResponse response = personService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody TokenRequest tokenRequest) {
        TokenResponse response = personService.refreshToken(tokenRequest.getRefreshToken());
        return ResponseEntity.ok(response);
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
