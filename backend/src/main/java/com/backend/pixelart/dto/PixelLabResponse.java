package com.backend.pixelart.dto;

import lombok.Data;

@Data
public class PixelLabResponse {
    private Usage usage;
    private Base64Image image;

    @Data
    public static class Usage {
        private String type;
        private double usd;
    }

    @Data
    public static class Base64Image {
        private String type;
        private String base64;
    }
}
