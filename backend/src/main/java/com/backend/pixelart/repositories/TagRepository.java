package com.backend.pixelart.repositories;

import com.backend.pixelart.models.TagModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<TagModel, Long> {
    Optional<TagModel> findByName(String name);
}
