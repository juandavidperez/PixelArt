package com.backend.pixelart.controllers;

import com.backend.pixelart.dto.PromptRequest;
import com.backend.pixelart.dto.ImageResponse;
import com.backend.pixelart.services.AiImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/images")
@Slf4j
@RequiredArgsConstructor
public class AiImageController {

    private final AiImageService aiImageService;

    @PostMapping("/generate")
    public CompletableFuture<ResponseEntity<ImageResponse>> generateImage(@RequestBody PromptRequest promptRequest) {
        return aiImageService.generateImage(promptRequest)
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> ResponseEntity.status(500).body(new ImageResponse(null)));
    }
}