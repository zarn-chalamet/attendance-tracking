package com.trainee_project.attendance_tracker_springboot.controller;

import com.trainee_project.attendance_tracker_springboot.dto.LoginRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.RegisterRequestDto;
import com.trainee_project.attendance_tracker_springboot.security.jwt.JwtAuthResponse;
import com.trainee_project.attendance_tracker_springboot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    //login user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto loginRequestDto) {

        JwtAuthResponse jwtResponse = authService.authenticateUser(loginRequestDto);

        return ResponseEntity.ok(jwtResponse);
    }

    //register user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDto registerRequestDto) {
        System.out.println("register user ran.");
        authService.createUser(registerRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body("Registered successfully.");
    }
}
