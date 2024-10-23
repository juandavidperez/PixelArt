package com.backend.pixelart.controllers;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.pixelart.models.UserModel;
import com.backend.pixelart.services.UserService;

@RestController
@CrossOrigin (origins = "*")
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping(path = "/get")
	public ArrayList<UserModel> getUsers(){
		return userService.getUsers();
	}
	
	@PostMapping(path = "/save")
	public ResponseEntity<UserModel> saveUser(@RequestBody UserModel user) {
        UserModel savedUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	}
	
	@GetMapping(path = "/get/{id}")
	public Optional<UserModel> getUserById(@PathVariable Long id) {
		return userService.getUserById(id);
	}
	
	@PostMapping(path = "/getUser")
	public Optional<UserModel> getUserByEmailAndPassword(@RequestBody UserModel user) {
		return userService.getUserByEmailAndPassword(user);
	}
	
	@PutMapping(path = "/update/{id}")
	public UserModel updateUserById(@RequestBody UserModel user, Long id) {
		return userService.updateById(user, id);
	}
	
	@DeleteMapping(path = "/delete/{id}")
	public String deleteUser(@PathVariable Long id) {
		boolean ok = userService.deleteUser(id);
		
		if(ok) {
			return "User con el id " + id + " eliminado exitosamente";
		}else {
			return "User con el id " + id + " no pudo ser eliminado";

		}
		
	}
	
}
