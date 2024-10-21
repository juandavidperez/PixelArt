package com.backend.pixelart.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.pixelart.models.UserModel;
import com.backend.pixelart.repositories.IUserRepository;

@Service
public class UserService {

	@Autowired
	private IUserRepository userRepository;
	
	public ArrayList<UserModel> getUsers(){
		return (ArrayList<UserModel>) userRepository.findAll();
	}
	
	public UserModel saveUser(UserModel user) {
		try {
			return userRepository.save(user);
		} catch (Exception e) {
	        throw new UserServiceException("Error al guardar el usuario: " + e.getMessage());
		}
	}
	
	public Optional<UserModel> getUserById(Long id) {
		return userRepository.findById(id);
	}
	
	public UserModel updateById(UserModel request, Long id) {
		UserModel usuario = userRepository.findById(id).get();
		
		usuario.setEmail(request.getEmail());
		usuario.setPassword(request.getPassword());
		usuario.setUsername(request.getUsername());
		
		return usuario;
	}
	
	public Boolean deleteUser(Long id) {
		try {
			userRepository.deleteById(id);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
}
