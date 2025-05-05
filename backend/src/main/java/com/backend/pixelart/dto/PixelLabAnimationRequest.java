package com.backend.pixelart.dto;

import java.util.List;
import java.util.Objects;

public class PixelLabAnimationRequest {
    public String description;
    private String action;
    public ImageSize image_size = new ImageSize();
    public Base64Image reference_image;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    //Opcionales
    public String negative_description = "blurry. dithering";
    public double text_guidance_scale = 8.0;
    public double image_guidance_scale = 1.4;
    public int n_frames = 4;
    public int start_frame_index = 0;
    public String view = "side";
    public String direction = "east";
    public List<Base64Image> init_images;
    public int init_image_strength = 300;

    public static class ImageSize {
        public int width = 64;
        public int height = 64;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ImageSize that = (ImageSize) o;
            return width == that.width && height == that.height;
        }

        @Override
        public int hashCode() {
            return Objects.hash(width, height);
        }

        @Override
        public String toString() {
            return "ImageSize{width=" + width + ", height=" + height + '}';
        }
    }

    public static class Base64Image {
        public String type = "base64";
        public String base64;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Base64Image that = (Base64Image) o;
            return Objects.equals(type, that.type) && Objects.equals(base64, that.base64);
        }

        @Override
        public int hashCode() {
            return Objects.hash(type, base64);
        }

        @Override
        public String toString() {
            return "Base64Image{type='" + type + "', base64='[REDACTED]'}";
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PixelLabAnimationRequest that = (PixelLabAnimationRequest) o;
        return Double.compare(that.text_guidance_scale, text_guidance_scale) == 0 &&
               Double.compare(that.image_guidance_scale, image_guidance_scale) == 0 &&
               n_frames == that.n_frames &&
               start_frame_index == that.start_frame_index &&
               init_image_strength == that.init_image_strength &&
               Objects.equals(description, that.description) &&
               Objects.equals(action, that.action) &&
               Objects.equals(negative_description, that.negative_description) &&
               Objects.equals(image_size, that.image_size) &&
               Objects.equals(view, that.view) &&
               Objects.equals(direction, that.direction) &&
               Objects.equals(init_images, that.init_images) &&
               Objects.equals(reference_image, that.reference_image);
    }

    @Override
    public int hashCode() {
        return Objects.hash(description, action, negative_description, image_size,
                text_guidance_scale, image_guidance_scale, n_frames, start_frame_index,
                view, direction, init_images, init_image_strength, reference_image);
    }

    @Override
    public String toString() {
        return "PixelLabAnimationRequest{" +
               "description='" + description + '\'' +
               ", action='" + action + '\'' +
               ", negative_description='" + negative_description + '\'' +
               ", image_size=" + image_size +
               ", text_guidance_scale=" + text_guidance_scale +
               ", image_guidance_scale=" + image_guidance_scale +
               ", n_frames=" + n_frames +
               ", start_frame_index=" + start_frame_index +
               ", view='" + view + '\'' +
               ", direction='" + direction + '\'' +
               ", init_images=" + init_images +
               ", init_image_strength=" + init_image_strength +
               ", reference_image=" + reference_image +
               '}';
    }
}
