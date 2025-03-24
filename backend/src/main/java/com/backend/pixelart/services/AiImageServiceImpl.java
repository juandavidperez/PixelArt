package com.backend.pixelart.services;

import com.backend.pixelart.dto.ImageResponse;
import com.backend.pixelart.dto.PromptRequest;
import com.backend.pixelart.exceptions.ImageGenerationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

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
//        requestBody.put("quality", "standard"); // o "hd" para alta definición
//        requestBody.put("style", "vivid"); // o "natural" para un estilo más natural

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
                    log.info("Data de respuesta: {}", data);

                    if (data instanceof java.util.List && !((java.util.List<?>) data).isEmpty()) {
                        Object firstImage = ((java.util.List<?>) data).get(0);
                        if (firstImage instanceof Map) {
                            Map<?, ?> imageMap = (Map<?, ?>) firstImage;
                            String imageUrl = (String) imageMap.get("url");

                            if (imageUrl != null) {
                                log.info("URL de imagen extraída: {}", imageUrl);
                                return new ImageResponse(imageUrl);
                            } else {
                                log.error("No se encontró la URL en la respuesta");
                                throw new ImageGenerationException("URL de imagen no encontrada en la respuesta");
                            }
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

    public CompletableFuture<ImageResponse> editImage(MultipartFile image, String prompt) {
        String editImageUrl = "https://api.openai.com/v1/images/edits";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(this.apiKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Convertir imagen a ByteArrayResource
        ByteArrayResource imageResource;
        try {
            imageResource = new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename() != null ? image.getOriginalFilename() : "image.png";
                }
            };
        } catch (Exception e) {
            log.error("Error al convertir la imagen: {}", e.getMessage(), e);
            throw new ImageGenerationException("Error al convertir la imagen: " + e.getMessage(), e);
        }
        //String enhancedPrompt = combinePrompts(systemPrompt, prompt); Dalle 2 se confunde muy facil
        // Construcción del cuerpo multipart
        MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("model", "dall-e-2");
        requestBody.add("prompt", prompt);
        requestBody.add("image", imageResource);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        return CompletableFuture.supplyAsync(() -> {
            try {
                ResponseEntity<Map> response = restTemplate.exchange(
                        editImageUrl,
                        HttpMethod.POST,
                        entity,
                        Map.class
                );

                Map responseBody = response.getBody();
                log.info("Respuesta del API de OpenAI: {}", responseBody); // Verifica la respuesta

                if (responseBody != null && responseBody.containsKey("data")) {
                    Object data = responseBody.get("data");
                    log.info("Data de respuesta: {}", data); // Verifica la estructura de 'data'

                    if (data instanceof java.util.List && !((java.util.List<?>) data).isEmpty()) {
                        Object firstImage = ((java.util.List<?>) data).get(0);
                        log.info("Primera imagen: {}", firstImage); // Verifica la primera imagen

                        if (firstImage instanceof Map) {
                            Map<?, ?> imageMap = (Map<?, ?>) firstImage;
                            String imageUrl = (String) imageMap.get("url");
                            log.info("URL de la imagen: {}", imageUrl); // Verifica la URL

                            if (imageUrl != null) {
                                log.info("Imagen editada generada exitosamente: {}", imageUrl);
                                return new ImageResponse(imageUrl);
                            }
                        }
                    }
                }
                throw new ImageGenerationException("Formato de respuesta inesperado al editar imagen");
            } catch (Exception e) {
                log.error("Error al editar imagen: {}", e.getMessage(), e);
                throw new ImageGenerationException("Error al procesar la edición de la imagen", e);
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