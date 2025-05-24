package com.backend.pixelart.services;

import com.backend.pixelart.dto.PixelArtGetDto;
import com.backend.pixelart.models.CategoryModel;
import com.backend.pixelart.models.PixelArtModel;
import com.backend.pixelart.models.TagModel;
import com.backend.pixelart.models.UserModel;
import com.backend.pixelart.repositories.CategoryRepository;
import com.backend.pixelart.repositories.IPixelArtRepository;
import com.backend.pixelart.repositories.TagRepository;
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
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;


    @Autowired
    public PixelArtService(IPixelArtRepository iPixelArtRepository, CategoryRepository categoryRepository, TagRepository tagRepository) {
        this.iPixelArtRepository = iPixelArtRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    public List<PixelArtGetDto> getAllPixelArts() {
        List<PixelArtModel> pixelArts = iPixelArtRepository.findAll();

        return pixelArts.stream().map(pixelArt -> {
            PixelArtGetDto dto = new PixelArtGetDto();
            dto.setId(pixelArt.getId());
            dto.setImage(pixelArt.getImage());
            dto.setTitle(pixelArt.getTitle());
            dto.setDescription(pixelArt.getDescription());

            if (pixelArt.getCategory() != null) {
                dto.setCategory(pixelArt.getCategory().getName());
            } else {
                dto.setCategory(null);
            }

            if (pixelArt.getTags() != null) {
                List<String> tagNames = pixelArt.getTags().stream()
                        .map(TagModel::getName)
                        .collect(Collectors.toList());
                dto.setTags(tagNames);
            } else {
                dto.setTags(Collections.emptyList());
            }

            if (pixelArt.getUserModel() != null) {
                dto.setUserName(pixelArt.getUserModel().getUsername());
            } else {
                dto.setUserName(null);
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public List<CategoryModel> getAllCategories() {
        return categoryRepository.findAll();
    }

    public void savePixelArt(byte[] image,
                             String title,
                             String description,
                             Long categoryId,
                             List<String> tagNames,
                             UserModel userModel) {
            PixelArtModel pixelArt = new PixelArtModel();
            pixelArt.setImage(image);
            pixelArt.setTitle(title);
            pixelArt.setDescription(description);
            pixelArt.setUserModel(userModel);

            CategoryModel category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            pixelArt.setCategory(category);

            List<TagModel> tags = new ArrayList<>();
            for (String tagName : tagNames) {
                TagModel tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            TagModel newTag = new TagModel();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        });
                tags.add(tag);
            }
            pixelArt.setTags(tags);

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
