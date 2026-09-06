package com.pahaarsaathi.service;

import com.pahaarsaathi.auth.GoogleTokenVerifier;
import com.pahaarsaathi.auth.Role;
import com.pahaarsaathi.auth.UserPrincipal;
import com.pahaarsaathi.config.JwtTokenProvider;
import com.pahaarsaathi.dto.AuthDTOs.*;
import com.pahaarsaathi.model.User;
import com.pahaarsaathi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuditService auditService;

    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        GoogleTokenVerifier.GoogleUserPayload payload = googleTokenVerifier.verify(request.getIdToken());
        if (payload == null) {
            throw new IllegalArgumentException("Invalid Google ID Token");
        }

        User user = userRepository.findByEmail(payload.getEmail())
                .orElseGet(() -> {
                    Role defaultRole = Role.ROLE_CITIZEN;
                    if (payload.getEmail().contains("admin") || payload.getEmail().contains("dma")) {
                        defaultRole = Role.ROLE_DISTRICT_ADMIN;
                    } else if (payload.getEmail().contains("officer") || payload.getEmail().contains("sdrf")) {
                        defaultRole = Role.ROLE_FIELD_OFFICER;
                    }

                    User newUser = new User(
                            payload.getEmail(),
                            payload.getName(),
                            payload.getPictureUrl(),
                            defaultRole,
                            request.getPreferredLanguage()
                    );
                    newUser.setGoogleSubId(payload.getSub());
                    newUser.setDistrictId("IN-ML-EKH"); // Default district: East Khasi Hills
                    return userRepository.save(newUser);
                });

        user.setLastLoginAt(LocalDateTime.now());
        if (payload.getPictureUrl() != null) {
            user.setPictureUrl(payload.getPictureUrl());
        }
        userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(principal);

        auditService.log("USER_LOGIN", user.getEmail(), "AUTH", null, "User logged in via Google OAuth2");

        UserProfileResponse profile = mapToProfile(user);
        return new AuthResponse(accessToken, refreshToken, jwtTokenProvider.getExpirationMs(), profile);
    }

    @Transactional
    public AuthResponse demoLogin(DemoLoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail() : "demo.user@pahaarsaathi.ner.gov.in";
        Role role = Role.fromString(request.getRole());

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(
                    email,
                    request.getName() != null ? request.getName() : "Demo User (" + role.name() + ")",
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                    role,
                    "en"
            );
            newUser.setDistrictId(request.getDistrictId() != null ? request.getDistrictId() : "IN-ML-EKH");
            return userRepository.save(newUser);
        });

        user.setRole(role);
        if (request.getDistrictId() != null) {
            user.setDistrictId(request.getDistrictId());
        }
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(principal);

        auditService.log("DEMO_LOGIN", user.getEmail(), "AUTH", null, "Demo login as " + role.name());

        UserProfileResponse profile = mapToProfile(user);
        return new AuthResponse(accessToken, refreshToken, jwtTokenProvider.getExpirationMs(), profile);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        String email = jwtTokenProvider.getEmailFromToken(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for token"));

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = jwtTokenProvider.generateAccessToken(principal);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(principal);

        return new AuthResponse(newAccessToken, newRefreshToken, jwtTokenProvider.getExpirationMs(), mapToProfile(user));
    }

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return mapToProfile(user);
    }

    public UserProfileResponse mapToProfile(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPictureUrl(),
                user.getRole(),
                user.getDistrictId(),
                user.getPhoneNumber(),
                user.getPreferredLanguage()
        );
    }
}
