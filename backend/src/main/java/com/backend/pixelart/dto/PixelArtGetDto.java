package com.backend.pixelart.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PixelArtGetDto {

    private Long id;
    private byte[] image;
    private String title;
    private String description;
    private String userName;

}
