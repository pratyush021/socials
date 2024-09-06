package com.librarymanagement.auth.dao;

import com.librarymanagement.auth.model.AuthUser;
import com.mongodb.client.result.DeleteResult;

import java.util.List;

public interface AuthUserDao  {
    public AuthUser findByUsername(String username);

    public AuthUser addUser(AuthUser user);

    public DeleteResult deleteUser(String username);

    public AuthUser updateUser(String username, String password);

    public List<AuthUser> getAllUsers();
}
