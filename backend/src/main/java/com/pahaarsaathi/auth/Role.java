package com.pahaarsaathi.auth;

public enum Role {
    ROLE_CITIZEN,
    ROLE_FIELD_OFFICER,
    ROLE_DISTRICT_ADMIN,
    ROLE_SUPER_ADMIN;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return ROLE_CITIZEN;
        try {
            if (!roleStr.startsWith("ROLE_")) {
                return Role.valueOf("ROLE_" + roleStr.toUpperCase());
            }
            return Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ROLE_CITIZEN;
        }
    }
}
