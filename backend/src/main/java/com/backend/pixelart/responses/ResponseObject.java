package com.backend.pixelart.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class ResponseObject<T> {
    private String message;
    private T data;
}
