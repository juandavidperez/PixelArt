package com.backend.pixelart.services;

import com.backend.pixelart.dto.PixelArtGetDto;
import com.backend.pixelart.models.PixelArtModel;
import com.backend.pixelart.models.UserModel;
import com.backend.pixelart.repositories.IPixelArtRepository;
import com.backend.pixelart.request.PixelArtRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PixelArtService {

    private final Map<Long, List<PixelArtModel>> pixelArtMap = new HashMap<>();
    private final IPixelArtRepository iPixelArtRepository;

    @Autowired
    public PixelArtService(IPixelArtRepository iPixelArtRepository) {
        this.iPixelArtRepository = iPixelArtRepository;
    }

    public List<PixelArtGetDto> getAllPixelArts() {
        List<PixelArtModel> pixelArts = iPixelArtRepository.findAll();

        return pixelArts.stream().map(pixelArt -> {
            PixelArtGetDto dto = new PixelArtGetDto();
            dto.setId(pixelArt.getId());
            dto.setImage(pixelArt.getImage());
            dto.setTitle(pixelArt.getTitle());
            dto.setDescription(pixelArt.getDescription());
            dto.setUserName(pixelArt.getUserModel() != null ? pixelArt.getUserModel().getUsername() : null);

            return dto;
        }).collect(Collectors.toList());
    }

    public void savePixelArt(byte[] image, String title, String description, UserModel userModel) {
            PixelArtModel pixelArt = new PixelArtModel();
            pixelArt.setImage(image);
            pixelArt.setTitle(title);
            pixelArt.setDescription(description);
            pixelArt.setUserModel(userModel);

            pixelArtMap.computeIfAbsent(userModel.getId(), k -> new ArrayList<>()).add(pixelArt);

            iPixelArtRepository.save(pixelArt);

    }


    public PixelArtModel updatePixelArt(Long id, PixelArtRequest pixelArtRequest) {

        PixelArtModel pixelArt = iPixelArtRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pixel Art no encontrado con ID: " + id));

        pixelArt.setTitle(pixelArtRequest.getTitle());
        pixelArt.setDescription(pixelArtRequest.getDescription());

        return iPixelArtRepository.save(pixelArt);
    }


    public Boolean deletePixelArt(Long id) {
        try {
            iPixelArtRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
