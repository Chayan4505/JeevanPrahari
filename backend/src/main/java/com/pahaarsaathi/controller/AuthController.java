package com.pahaarsaathi.controller;

import com.pahaarsaathi.auth.UserPrincipal;
import com.pahaarsaathi.dto.AuthDTOs.*;
import com.pahaarsaathi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Google OAuth2 and JWT session token endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/google")
    @Operation(summary = "Authenticate with Google ID Token")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        AuthResponse response = authService.authenticateWithGoogle(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/demo-login")
    @Operation(summary = "Demo login for instant role switching without Google account (Citizen, Officer, Admin)")
    public ResponseEntity<AuthResponse> demoLogin(@RequestBody DemoLoginRequest request) {
        AuthResponse response = authService.demoLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh expired access token with valid refresh token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserProfileResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        UserProfileResponse profile = authService.getProfile(principal.getEmail());
        return ResponseEntity.ok(profile);
    }
}
