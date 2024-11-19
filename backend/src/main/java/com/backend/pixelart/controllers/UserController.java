package com.backend.pixelart.controllers;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.pixelart.dto.AuthResponse;
import com.backend.pixelart.models.UserModel;
import com.backend.pixelart.services.UserService;
import com.backend.pixelart.util.JwtUtil;

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

	@GetMapping("/getUsername/{username}")
	public ResponseEntity<UserModel> getUserByUsername(@PathVariable String username) {
		Optional<UserModel> userOptional = userService.getUserByUsername(username);

		if (userOptional.isPresent()) {
			return new ResponseEntity<>(userOptional.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping(path = "/getUser")
	public Optional<UserModel> getUserByEmailAndPassword(@RequestBody UserModel user) {
		return userService.getUserByEmailAndPassword(user);
	}
	
	@PutMapping(path = "/update/{id}")
	public UserModel updateUserById(@RequestBody UserModel user, @PathVariable(name = "id") Long id) {
		return userService.updateById(user, id);
	}
	
	@DeleteMapping(path = "/delete/{id}")
	public String deleteUser(@PathVariable(name = "id") Long id) {
		boolean ok = userService.deleteUser(id);
		
		if(ok) {
			return "User con el id " + id + " eliminado exitosamente";
		}else {
			return "User con el id " + id + " no pudo ser eliminado";

		}
		
	}
	
    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody UserModel user) {
        Optional<UserModel> authenticatedUser = userService.getUserByEmailAndPassword(user);

        if (authenticatedUser.isPresent()) {
            String token = JwtUtil.generateToken(authenticatedUser.get().getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }
	
}
