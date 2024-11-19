package com.backend.pixelart.request;

import lombok.*;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class PixelArtRequest {
    private String title;
    private String description;
}