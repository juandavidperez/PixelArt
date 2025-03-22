package com.backend.pixelart.services;

import com.backend.pixelart.dto.ImageResponse;
import com.backend.pixelart.dto.PromptRequest;

import java.util.concurrent.CompletableFuture;

public interface AiImageService {
    CompletableFuture<ImageResponse> generateImage(PromptRequest promptRequest);
}