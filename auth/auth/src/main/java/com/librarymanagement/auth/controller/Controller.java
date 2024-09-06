package com.librarymanagement.auth.controller;

import com.librarymanagement.auth.model.AuthUser;
import com.librarymanagement.auth.services.DatabaseOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    private DatabaseOperationService databaseOperationService;

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestParam("username") String username,@RequestParam("password") String password) throws Exception {
        return ResponseEntity.ok(databaseOperationService.addUser(username, password));
    }

    @GetMapping("/validateUser")
    public ResponseEntity<String> validateUser(@RequestParam("username") String username) throws Exception {
            return ResponseEntity.ok("Valid User");
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam("username") String username) throws Exception {
        String response = databaseOperationService.deleteUser(username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateUser")
    public ResponseEntity<String> updateUser(@RequestParam("username") String username,@RequestParam("password") String password) throws Exception {
        String response = databaseOperationService.updateUser(username, password);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AuthUser>> getAllUsers() {
        return ResponseEntity.ok(databaseOperationService.getAllUsers());
    }

}
