package com.trainee_project.attendance_tracker_springboot.service;

import com.trainee_project.attendance_tracker_springboot.dto.UserResponseDto;

import java.util.List;

public interface UserService {
    List<UserResponseDto> getUserList(String email);

    UserResponseDto getUserById(String userId);

    UserResponseDto updateFaceEmbeddingJson(String userId, String faceEmbeddingJson);

    UserResponseDto getUserProfile(String email);
}
