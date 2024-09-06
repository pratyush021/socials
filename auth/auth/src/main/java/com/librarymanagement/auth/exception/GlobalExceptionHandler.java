package com.librarymanagement.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlerUserNotFoundException( UserNotFoundException ex, WebRequest request) {
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("error", ex.getMessage());
        responseMap.put("status", HttpStatus.NOT_FOUND.toString());
        return new ResponseEntity<>(responseMap, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(InvalidInputDetailsException.class)
    public ResponseEntity<Map<String, String>> handlerInvalidException(InvalidInputDetailsException ex, WebRequest request) {
        Map<String, String> map = new HashMap<>();
        map.put("error", ex.getMessage());
        map.put("status", HttpStatus.BAD_REQUEST.toString());
        return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
    }

}
