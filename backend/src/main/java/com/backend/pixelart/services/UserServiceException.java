package com.backend.pixelart.services;

public class UserServiceException extends RuntimeException {
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 6223783802507367590L;

	public UserServiceException(String message) {
        super(message);
    }
}