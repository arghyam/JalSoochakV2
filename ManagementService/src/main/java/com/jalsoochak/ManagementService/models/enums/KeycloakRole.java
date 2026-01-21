package com.jalsoochak.ManagementService.models.enums;

public enum KeycloakRole {
    SUPER_USER("super_user"),
    STATE_ADMIN("state_admin");

    private final String roleName;

    KeycloakRole(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }
}