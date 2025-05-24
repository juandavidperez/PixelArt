package com.backend.pixelart.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PixelArtGetDto {

    private Long id;
    private byte[] image;
    private String title;
    private String description;
    private String category;
    private List<String> tags;
    private String userName;

}
