package com.librarymanagement.auth.services;

import ch.qos.logback.core.util.StringUtil;
import com.librarymanagement.auth.dao.AuthUserDao;
import com.librarymanagement.auth.exception.InvalidInputDetailsException;
import com.librarymanagement.auth.exception.UserNotFoundException;
import com.librarymanagement.auth.model.AuthUser;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatabaseOperationService {

    @Autowired
    private AuthUserDao authUserDao;

    public boolean isUserExist(String username) {
        if (username == null || StringUtils.isEmpty(username)) {
            throw new InvalidInputDetailsException("Username cannot be empty");
        }
        return authUserDao.findByUsername(username) != null;
    }

    public String addUser(String username, String password) throws Exception {

        if (isUserExist(username)) {
            throw new UserNotFoundException("User Already Exist");
        }
        AuthUser user = AuthUser.builder().username(username).password(password).build();
        authUserDao.addUser(user);
        return "User added successfully";
    }
    public String deleteUser(String username) throws Exception {
        if(username == null || StringUtils.isEmpty(username)) {
            throw new InvalidInputDetailsException("Invalid username");
        }
        if(!isUserExist(username)) {
            throw new UserNotFoundException("User does not exist");
        }
        authUserDao.deleteUser(username);
        return "User deleted successfully";
    }
    public String updateUser(String username, String password) throws Exception {
        validate(username, password);
        if(!isUserExist(username)) {
            throw new UserNotFoundException("User does not exist");
        }
        authUserDao.updateUser(username, password);
        return "User updated successfully";
    }
    public List<AuthUser> getAllUsers() {
        return authUserDao.getAllUsers();
    }
    private void validate(String username, String password) {
        if(username == null || StringUtils.isEmpty(username) || password == null || StringUtils.isEmpty(password)) {
            throw new InvalidInputDetailsException("Invalid username or password!");
        }
    }
}
