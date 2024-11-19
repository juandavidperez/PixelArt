package com.backend.pixelart.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "Pixel_Art_Draws")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PixelArtModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pixel_art")
    private Long id;

    @Column( length = 100000)
    private byte[] image;

    @Column( length = 30)
    private String title;

    @Column( length = 500)
    private String description;

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonBackReference
    private UserModel userModel;

}
