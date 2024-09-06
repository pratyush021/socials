package com.librarymanagement.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "auth_user")
public class AuthUser implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String userId;
    private String username;
    private String password;
}
