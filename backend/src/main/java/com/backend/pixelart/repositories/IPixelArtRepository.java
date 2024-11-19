package com.backend.pixelart.repositories;

import com.backend.pixelart.models.PixelArtModel;
import com.backend.pixelart.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IPixelArtRepository extends JpaRepository<PixelArtModel,Long> {
    boolean existsByUserModel(UserModel userModel);
}
