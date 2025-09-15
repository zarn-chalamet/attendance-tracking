package com.trainee_project.attendance_tracker_springboot.service;

import com.trainee_project.attendance_tracker_springboot.dto.LoginRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.RegisterRequestDto;
import com.trainee_project.attendance_tracker_springboot.security.jwt.JwtAuthResponse;

public interface AuthService {
    
    JwtAuthResponse authenticateUser(LoginRequestDto loginRequestDto);

    void createUser(RegisterRequestDto registerRequestDto);
}
