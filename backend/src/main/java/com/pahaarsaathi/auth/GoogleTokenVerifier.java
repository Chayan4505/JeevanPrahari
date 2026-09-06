package com.pahaarsaathi.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class GoogleTokenVerifier {

    @Value("${pahaarsaathi.auth.google-client-id:pahaarsaathi-demo-client-id.apps.googleusercontent.com}")
    private String googleClientId;

    public GoogleUserPayload verify(String idTokenString) {
        // 1. Check for demo / mock token in local dev or sandbox
        if (idTokenString != null && (idTokenString.startsWith("demo-token-") || idTokenString.startsWith("mock-google-token-"))) {
            return parseDemoToken(idTokenString);
        }

        // 2. Real Google OAuth 2.0 ID Token verification
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String sub = payload.getSubject();

                return new GoogleUserPayload(sub, email, name, pictureUrl);
            }
        } catch (Exception e) {
            System.err.println("[JeevanPrahari Auth] Google ID token verification error: " + e.getMessage());
        }

        return null;
    }

    private GoogleUserPayload parseDemoToken(String token) {
        if (token.contains("admin")) {
            return new GoogleUserPayload("demo-sub-admin-01", "district.admin@jeevenprahari.ner.gov.in", "Dima Hasao Disaster Admin", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        } else if (token.contains("officer")) {
            return new GoogleUserPayload("demo-sub-officer-01", "field.officer@jeevenprahari.ner.gov.in", "Officer T. Sangma (SDRF)", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        } else {
            return new GoogleUserPayload("demo-sub-citizen-01", "citizen.ner@gmail.com", "R. Khongwir (Citizen)", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
        }
    }

    public static class GoogleUserPayload {
        private final String sub;
        private final String email;
        private final String name;
        private final String pictureUrl;

        public GoogleUserPayload(String sub, String email, String name, String pictureUrl) {
            this.sub = sub;
            this.email = email;
            this.name = name;
            this.pictureUrl = pictureUrl;
        }

        public String getSub() { return sub; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getPictureUrl() { return pictureUrl; }
    }
}
