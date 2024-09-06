package com.librarymanagement.auth.dao.impl;

import com.librarymanagement.auth.dao.AuthUserDao;
import com.librarymanagement.auth.model.AuthUser;
import com.librarymanagement.auth.util.Constants;
import com.mongodb.client.result.DeleteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuthUserDaoImpl implements AuthUserDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public AuthUser findByUsername(String username) {
        // add a query where username is equal to the username parameter
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(username));
        return mongoTemplate.findOne(query, AuthUser.class);

    }

    @Override
    public AuthUser addUser(AuthUser user) {
        user.setUserId(Constants.USR + Constants.DASH + (int)(Math.random() * 9000) + 1000);
        mongoTemplate.save(user, "auth_user");
        return user;
    }

    @Override
    public DeleteResult deleteUser(String username) {
        Query query = new Query(Criteria.where("username").is(username));
        return mongoTemplate.remove(query, AuthUser.class);
    }

    @Override
    public AuthUser updateUser(String username, String password) {
        Query query = new Query(Criteria.where("username").is(username));
        Update update = new Update().set("password", password);
        mongoTemplate.findAndModify(query, update, AuthUser.class);
        return null;
    }

    @Override
    public List<AuthUser> getAllUsers() {
        return mongoTemplate.findAll(AuthUser.class);
    }
}
