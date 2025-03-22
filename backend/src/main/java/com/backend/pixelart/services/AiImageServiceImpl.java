package com.backend.pixelart.services;

import com.backend.pixelart.dto.ImageResponse;
import com.backend.pixelart.dto.PromptRequest;
import com.backend.pixelart.exceptions.ImageGenerationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class AiImageServiceImpl implements AiImageService {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;
    private final String systemPrompt;

    public AiImageServiceImpl(
            RestTemplate restTemplate,
            @Value("${ai.image.api.url}") String apiUrl,
            @Value("${ai.image.api.key}") String apiKey,
            @Value("${ai.image.system.prompt:Genera imágenes en estilo pixel art}") String systemPrompt) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.systemPrompt = systemPrompt;
    }

    @Override
    public CompletableFuture<ImageResponse> generateImage(PromptRequest promptRequest) {
        Map<String, Object> requestBody = new HashMap<>();

        // Combinar el system prompt con el prompt del usuario
        String enhancedPrompt = combinePrompts(systemPrompt, promptRequest.getPrompt());
        requestBody.put("prompt", enhancedPrompt);
        requestBody.put("n", 1);
        requestBody.put("size", "1024x1024");

        // Para DALL-E 3, puedes usar el parámetro "model" para especificar la versión
        requestBody.put("model", "dall-e-3");

        // Puedes añadir parámetros de calidad y estilo si estás usando DALL-E 3
        requestBody.put("quality", "standard"); // o "hd" para alta definición
        requestBody.put("style", "vivid"); // o "natural" para un estilo más natural

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        log.info("Enviando solicitud a OpenAI para generar imagen con prompt: {}", enhancedPrompt);

        return CompletableFuture.supplyAsync(() -> {
            try {
                ResponseEntity<Map> response = restTemplate.exchange(
                        apiUrl,
                        HttpMethod.POST,
                        requestEntity,
                        Map.class
                );

                Map responseBody = response.getBody();
                log.info("Respuesta recibida de OpenAI");

                if (responseBody != null && responseBody.containsKey("data")) {
                    Object data = responseBody.get("data");
                    if (data instanceof java.util.List && !((java.util.List<?>) data).isEmpty()) {
                        Object firstImage = ((java.util.List<?>) data).get(0);
                        if (firstImage instanceof Map) {
                            String imageUrl = (String) ((Map<?, ?>) firstImage).get("url");
                            return new ImageResponse(imageUrl);
                        }
                    }
                    throw new ImageGenerationException("Formato de respuesta inesperado");
                }
                throw new ImageGenerationException("Respuesta vacía de OpenAI");
            } catch (Exception e) {
                log.error("Error al comunicarse con OpenAI: {}", e.getMessage(), e);
                throw new ImageGenerationException("Error al generar imagen: " + e.getMessage(), e);
            }
        });
    }

    /**
     * Combina el system prompt con el prompt del usuario para mejorar la generación de imágenes
     * @param systemPrompt El prompt del sistema que define el estilo o contexto general
     * @param userPrompt El prompt específico del usuario
     * @return El prompt combinado
     */
    private String combinePrompts(String systemPrompt, String userPrompt) {
        // Reemplaza {user_input} con el prompt del usuario
        String finalPrompt = systemPrompt.replace("{user_input}", userPrompt);

        // Si no hay {user_input} en el system prompt, simplemente concatena
        if (finalPrompt.equals(systemPrompt)) {
            finalPrompt = systemPrompt + " " + userPrompt;
        }
        return finalPrompt;
    }
}