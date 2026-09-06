package com.pahaarsaathi.dto;

import com.pahaarsaathi.auth.Role;

public class AuthDTOs {

    public static class GoogleAuthRequest {
        private String idToken;
        private String preferredLanguage = "en";

        public GoogleAuthRequest() {}
        public GoogleAuthRequest(String idToken) { this.idToken = idToken; }

        public String getIdToken() { return idToken; }
        public void setIdToken(String idToken) { this.idToken = idToken; }
        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    }

    public static class DemoLoginRequest {
        private String email;
        private String name;
        private String role; // CITIZEN, FIELD_OFFICER, DISTRICT_ADMIN, SUPER_ADMIN
        private String districtId;

        public DemoLoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
    }

    public static class RefreshTokenRequest {
        private String refreshToken;

        public RefreshTokenRequest() {}
        public RefreshTokenRequest(String refreshToken) { this.refreshToken = refreshToken; }

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private Long expiresIn;
        private UserProfileResponse user;

        public AuthResponse() {}
        public AuthResponse(String accessToken, String refreshToken, Long expiresIn, UserProfileResponse user) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.expiresIn = expiresIn;
            this.user = user;
        }

        public String getAccessToken() { return accessToken; }
        public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }
        public Long getExpiresIn() { return expiresIn; }
        public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
        public UserProfileResponse getUser() { return user; }
        public void setUser(UserProfileResponse user) { this.user = user; }
    }

    public static class UserProfileResponse {
        private Long id;
        private String email;
        private String name;
        private String pictureUrl;
        private Role role;
        private String districtId;
        private String phoneNumber;
        private String preferredLanguage;

        public UserProfileResponse() {}
        public UserProfileResponse(Long id, String email, String name, String pictureUrl, Role role, String districtId, String phoneNumber, String preferredLanguage) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.pictureUrl = pictureUrl;
            this.role = role;
            this.districtId = districtId;
            this.phoneNumber = phoneNumber;
            this.preferredLanguage = preferredLanguage;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPictureUrl() { return pictureUrl; }
        public void setPictureUrl(String pictureUrl) { this.pictureUrl = pictureUrl; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    }
}
