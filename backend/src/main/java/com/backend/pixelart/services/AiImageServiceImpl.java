package com.backend.pixelart.services;

import com.backend.pixelart.dto.*;
import com.backend.pixelart.exceptions.ImageGenerationException;
import com.madgag.gif.fmsware.AnimatedGifEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class AiImageServiceImpl implements AiImageService {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;

    public AiImageServiceImpl(
            RestTemplate restTemplate,
            @Value("${pixellab.api.url}") String apiUrl,
            @Value("${pixellab.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    @Override
    public CompletableFuture<ImageResponse> generateImage(PromptRequest promptRequest) {
        PixelLabRequest request = new PixelLabRequest();
        request.setDescription(promptRequest.getPrompt());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<PixelLabRequest> requestEntity = new HttpEntity<>(request, headers);

        log.info("Sending request to PixelLab to generate image with prompt: {}", promptRequest.getPrompt());

        return CompletableFuture.supplyAsync(() -> {
            try {
                ResponseEntity<PixelLabResponse> response = restTemplate.exchange(
                        apiUrl,
                        HttpMethod.POST,
                        requestEntity,
                        PixelLabResponse.class
                );
                log.info("Prompt completo:"+request);
                PixelLabResponse responseBody = response.getBody();
                log.info("Response received from PixelLab");

                if (responseBody != null && responseBody.getImage() != null) {
                    String base64Image = responseBody.getImage().getBase64();
                    // Convert base64 to data URL format
                    String imageUrl = "data:image/png;base64," + base64Image;
                    return new ImageResponse(imageUrl);
                }
                
                throw new ImageGenerationException("Empty response from PixelLab");
            } catch (Exception e) {
                log.error("Error communicating with PixelLab: {}", e.getMessage(), e);
                throw new ImageGenerationException("Error generating image: " + e.getMessage(), e);
            }
        });
    }

    @Override
    public CompletableFuture<ImageResponse> editImage(MultipartFile image, String prompt) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                PixelLabRequest request = new PixelLabRequest();
                request.setDescription(prompt);
                log.info("Sending request to PixelLab to generate image with prompt: {}", prompt +"direction " + request.getDirection() + "negativo des:" + request.getNegative_description() + "image str:" +request.getInit_image_strength());

                // Convert image to base64
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                
                PixelLabRequest.Base64Image initImage = new PixelLabRequest.Base64Image();
                initImage.setBase64(base64Image);
                request.setInit_image(initImage);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Bearer " + apiKey);


                HttpEntity<PixelLabRequest> requestEntity = new HttpEntity<>(request, headers);

                ResponseEntity<PixelLabResponse> response = restTemplate.exchange(
                        apiUrl,
                        HttpMethod.POST,
                        requestEntity,
                        PixelLabResponse.class
                );
                log.info("Prompt:"+request);
                PixelLabResponse responseBody = response.getBody();
                if (responseBody != null && responseBody.getImage() != null) {
                    String base64Response = responseBody.getImage().getBase64();
                    String imageUrl = "data:image/png;base64," + base64Response;
                    return new ImageResponse(imageUrl);
                }

                throw new ImageGenerationException("Empty response from PixelLab");
            } catch (Exception e) {
                log.error("Error editing image with PixelLab: {}", e.getMessage(), e);
                throw new ImageGenerationException("Error editing image: " + e.getMessage(), e);
            }
        });
    }

    @Override
    public CompletableFuture<ImageResponse> generateAnimation(MultipartFile image, PromptRequest promptRequest,
                                                              String action){
        return CompletableFuture.supplyAsync(() -> {
            try{
                PixelLabAnimationRequest request = new PixelLabAnimationRequest();
                request.setDescription(promptRequest.getPrompt());
                request.setAction(action);

                log.info("Sending Animation request: promp: {} , Action: {}", promptRequest, action);

                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);

                PixelLabAnimationRequest.Base64Image referenceImage = new PixelLabAnimationRequest.Base64Image();
                referenceImage.base64 = base64Image;
                request.reference_image = referenceImage;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization","Bearer "+ apiKey);

                HttpEntity<PixelLabAnimationRequest> requestHttpEntity =
                        new HttpEntity<>(request, headers);
                String animationApiUrl ="https://api.pixellab.ai/v1/animate-with-text";

                ResponseEntity<PixelLabAnimationResponse> response = restTemplate.exchange(
                        animationApiUrl,
                        HttpMethod.POST,
                        requestHttpEntity,
                        PixelLabAnimationResponse.class
                );

                PixelLabAnimationResponse responseBody = response.getBody();
                if (responseBody != null && responseBody.getImages() != null && !responseBody.getImages().isEmpty()) {
                    // Convert base64 frames to BufferedImages
                    List<PixelLabAnimationResponse.Base64Image> frames = responseBody.getImages();
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

                    AnimatedGifEncoder gifEncoder = new AnimatedGifEncoder();
                    gifEncoder.start(outputStream);
                    gifEncoder.setRepeat(0); // loop forever
                    gifEncoder.setDelay(100); // frame delay in ms (adjust as needed)

                    for (PixelLabAnimationResponse.Base64Image frame : frames) {
                        byte[] decodedBytes = Base64.getDecoder().decode(frame.base64);
                        ByteArrayInputStream bais = new ByteArrayInputStream(decodedBytes);
                        BufferedImage bufferedImage = ImageIO.read(bais);
                        gifEncoder.addFrame(bufferedImage);
                    }

                    gifEncoder.finish();

                    // Convert GIF to base64
                    String base64Gif = Base64.getEncoder().encodeToString(outputStream.toByteArray());
                    String gifDataUrl = "data:image/gif;base64," + base64Gif;

                    return new ImageResponse(gifDataUrl);

                }
                throw new ImageGenerationException("Empty response from PixelLab Animation API");

            }catch (Exception e){
                log.error("Error generating animation with PixelLab: {}", e.getMessage(), e);
                throw new ImageGenerationException("Error generating animation" + e.getMessage(),e);

            }
        });
    }
}