package com.backend.pixelart.exceptions;

public class ExternalServiceException extends RuntimeException {
  public ExternalServiceException(String message) {
    super(message);
  }

  public ExternalServiceException(String message, Throwable cause) {
    super(message, cause);
  }
}