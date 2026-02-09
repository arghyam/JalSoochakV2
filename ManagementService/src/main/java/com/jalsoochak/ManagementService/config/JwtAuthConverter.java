package com.jalsoochak.ManagementService.config;

import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.repositories.PersonMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Converts Keycloak JWT tokens into Spring Security authentication tokens.
 *
 * Roles are resolved from two sources:
 * 1. Keycloak JWT realm_access.roles (for Keycloak-assigned roles like STATE_ADMIN)
 * 2. Database PersonMaster.personType.cName (for application-level roles like super_user)
 *
 * This ensures backward compatibility since the application previously checked
 * roles from the database rather than from Keycloak.
 *
 * Each role is prefixed with "ROLE_" so Spring's hasRole() works correctly.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final PersonMasterRepository personMasterRepository;

    private final JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
            new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = Stream.of(
                jwtGrantedAuthoritiesConverter.convert(jwt),
                extractRealmRoles(jwt),
                extractDatabaseRoles(jwt)
        ).flatMap(Collection::stream).collect(Collectors.toSet());

        return new JwtAuthenticationToken(jwt, authorities, getPrincipalName(jwt));
    }

    /**
     * Extracts roles from Keycloak's realm_access.roles claim in the JWT.
     */
    private Collection<GrantedAuthority> extractRealmRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess == null) {
            return Collections.emptySet();
        }

        Object rolesObj = realmAccess.get("roles");
        if (!(rolesObj instanceof List<?>)) {
            return Collections.emptySet();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) rolesObj;

        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toSet());
    }

    /**
     * Looks up the user's role from the database (PersonMaster.personType.cName)
     * using the preferred_username claim (phone number) from the JWT.
     * This preserves the original behavior where roles were checked from the database.
     */
    private Collection<GrantedAuthority> extractDatabaseRoles(Jwt jwt) {
        try {
            String username = jwt.getClaimAsString("preferred_username");
            if (username == null || username.isBlank()) {
                return Collections.emptySet();
            }

            Optional<PersonMaster> personOpt = personMasterRepository.findByPhoneNumber(username);
            if (personOpt.isEmpty()) {
                return Collections.emptySet();
            }

            PersonMaster person = personOpt.get();
            if (person.getPersonType() != null && person.getPersonType().getCName() != null) {
                String dbRole = person.getPersonType().getCName();
                Set<GrantedAuthority> dbAuthorities = new HashSet<>();
                dbAuthorities.add(new SimpleGrantedAuthority("ROLE_" + dbRole));
                return dbAuthorities;
            }
        } catch (Exception e) {
            log.error("Error extracting database roles from JWT", e);
        }

        return Collections.emptySet();
    }

    private String getPrincipalName(Jwt jwt) {
        String preferredUsername = jwt.getClaimAsString("preferred_username");
        return preferredUsername != null ? preferredUsername : jwt.getSubject();
    }
}
