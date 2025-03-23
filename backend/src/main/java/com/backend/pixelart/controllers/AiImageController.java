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
@CrossOrigin(origins = "http://localhost:4200")
public class AiImageController {

    private final AiImageService aiImageService;

    @PostMapping("/generate")
    public CompletableFuture<ResponseEntity<ImageResponse>> generateImage(@RequestBody PromptRequest promptRequest) {
        return aiImageService.generateImage(promptRequest)
                .thenApply(response -> {
                    log.info("Enviando respuesta a Angular: {}", response);
                    return ResponseEntity.ok(response);
                })
                .exceptionally(ex -> {
                    log.error("Error al generar imagen: {}", ex.getMessage());
                    return ResponseEntity.status(500).body(new ImageResponse(null));
                });
    }
}