package com.backend.pixelart.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.pixelart.models.UserModel;

@Repository
public interface IUserRepository extends JpaRepository<UserModel, Long>{
    Optional<UserModel> findByEmailAndPassword(String email, String password);

    Optional<UserModel> findByUsername(String username);
	
}
