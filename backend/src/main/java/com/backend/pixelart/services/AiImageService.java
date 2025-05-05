package com.backend.pixelart.services;

import com.backend.pixelart.dto.ImageResponse;
import com.backend.pixelart.dto.PixelLabAnimationRequest;
import com.backend.pixelart.dto.PromptRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.CompletableFuture;

public interface AiImageService {
    CompletableFuture<ImageResponse> generateImage(PromptRequest promptRequest);
    CompletableFuture<ImageResponse> editImage(MultipartFile image, String prompt);
    CompletableFuture<ImageResponse> generateAnimation(PixelLabAnimationRequest request);

}