package com.backend.pixelart.dto;

import lombok.Data;

@Data
public class PixelLabRequest {
    private String description;
    private String negative_description = "blurry. dithering";
    private PixelLabImageSize image_size = new PixelLabImageSize();
    private double text_guidance_scale = 3.0;
    private String outline = "selective outline";
    private String shading = "basic shading";
    private String detail = "low detail";
    private String view = "side";
    private String direction = "south";
    private boolean isometric = false;
    private boolean no_background = true;
    private Base64Image init_image;
    private int init_image_strength = 50;
    private Base64Image color_image;
    private Integer seed;

    @Data
    public static class Base64Image {
        private String type = "base64";
        private String base64 = "";
    }
}
