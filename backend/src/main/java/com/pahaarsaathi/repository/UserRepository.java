package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleSubId(String googleSubId);
    boolean existsByEmail(String email);
}
