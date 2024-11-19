package com.backend.pixelart.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class UserModel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true)
	private String username;
	
	@Column
	private String password;
	
	@Column
	private String email;

	@OneToMany(mappedBy = "userModel", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PixelArtModel> pixelArts = new ArrayList<>();

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<PixelArtModel> getPixelArts() {
		return pixelArts;
	}

	public void setPixelArts(List<PixelArtModel> pixelArts) {
		this.pixelArts = pixelArts;
	}
}
