package com.backend.pixelart.responses;

import com.backend.pixelart.models.PixelArtModel;
import com.fasterxml.jackson.annotation.JsonProperty;

public record PixelArtResponse (
        @JsonProperty("id_pixel_art")
        Long pixelArtId,
        String title,
        String description

){

    public PixelArtResponse(PixelArtModel pixelArtModel) {
        this(
                pixelArtModel.getId(),
                pixelArtModel.getTitle(),
                pixelArtModel.getDescription()
        );
    }

}
