package com.trainee_project.attendance_tracker_springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequestDto {

    private String username;

    private String email;

    private String password;

//    this will be uncommented in the next process
//    @Lob
//    private String faceEmbeddingJson;

    private String officeId;
}
