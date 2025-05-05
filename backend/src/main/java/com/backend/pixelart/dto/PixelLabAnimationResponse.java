package com.backend.pixelart.dto;

import java.util.List;

public class PixelLabAnimationResponse {

    private List<Base64Image> images;
    private Usage usage;

    public static class Base64Image {
        public String type; // Always "base64"
        public String base64; // The base64 encoded image data


    }
    public static class Usage {
        public String type; // "credits" or "usd" based on your API response
        public double credits; // Or "usd" depending on the response


    }

    public List<Base64Image> getImages() {
        return images;
    }

    public void setImages(List<Base64Image> images) {
        this.images = images;
    }

    public Usage getUsage() {
        return usage;
    }

    public void setUsage(Usage usage) {
        this.usage = usage;
    }
}
