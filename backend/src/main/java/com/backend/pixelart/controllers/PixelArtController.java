package com.backend.pixelart.controllers;

import com.backend.pixelart.dto.PixelArtGetDto;
import com.backend.pixelart.models.PixelArtModel;
import com.backend.pixelart.models.UserModel;
import com.backend.pixelart.request.PixelArtRequest;
import com.backend.pixelart.responses.PixelArtResponse;
import com.backend.pixelart.responses.ResponseObject;
import com.backend.pixelart.services.PixelArtService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/art")
public class PixelArtController {

    @Autowired
    private PixelArtService pixelArtService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<PixelArtGetDto> getArts(){
        return pixelArtService.getAllPixelArts();
    }

    @PostMapping(path = "create" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> savePixelArt(
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category_id") Long categoryId,
            @RequestParam("tag") List<String> tagNames,
            @RequestParam("userId") Long userId
    ) {
        try {
            byte[] imageBytes = imageFile.getBytes();
            UserModel userModel = new UserModel();
            userModel.setId(userId);
            pixelArtService.savePixelArt(imageBytes, title, description, categoryId , tagNames , userModel);
            return ResponseEntity.ok("Pixel Art guardado con éxito");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la imagen: " + e.getMessage());
        }
    }


    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseObject<PixelArtResponse>> updateArtById(
            @PathVariable Long id,
            @RequestBody PixelArtRequest pixelArtRequest
    ) {
        try {
            PixelArtModel updatedPixelArt = pixelArtService.updatePixelArt(id, pixelArtRequest);
            PixelArtResponse response = new PixelArtResponse(updatedPixelArt);
            return ResponseEntity.ok(new ResponseObject<>("Pixel Art actualizado con éxito", response));

        } catch (EntityNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject<>(e.getMessage(), null));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject<>("Error al actualizar el Pixel Art", null));

        }
    }


    @DeleteMapping(path = "/{id}")
    public String deletePixelArt(@PathVariable(name = "id") Long id) {
        boolean ok = pixelArtService.deletePixelArt(id);

        if(ok) {
            return "Pixel art con el id " + id + " eliminado exitosamente";
        }else {
            return "Pixel art con el id " + id + " no pudo ser eliminado";
        }

    }

}
