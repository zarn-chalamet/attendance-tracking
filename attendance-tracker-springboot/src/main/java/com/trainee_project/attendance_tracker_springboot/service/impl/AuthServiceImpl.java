package com.trainee_project.attendance_tracker_springboot.service.impl;

import com.trainee_project.attendance_tracker_springboot.dto.LoginRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.RegisterRequestDto;
import com.trainee_project.attendance_tracker_springboot.exception.OfficeNotFoundException;
import com.trainee_project.attendance_tracker_springboot.exception.UserAlreadyExistException;
import com.trainee_project.attendance_tracker_springboot.model.OfficeLocation;
import com.trainee_project.attendance_tracker_springboot.model.Role;
import com.trainee_project.attendance_tracker_springboot.model.User;
import com.trainee_project.attendance_tracker_springboot.repository.OfficeLocationRepository;
import com.trainee_project.attendance_tracker_springboot.repository.UserRepository;
import com.trainee_project.attendance_tracker_springboot.security.UserDetailsImpl;
import com.trainee_project.attendance_tracker_springboot.security.jwt.JwtAuthResponse;
import com.trainee_project.attendance_tracker_springboot.security.jwt.JwtTokenProvider;
import com.trainee_project.attendance_tracker_springboot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final OfficeLocationRepository officeLocationRepository;

    @Override
    public JwtAuthResponse authenticateUser(LoginRequestDto loginRequestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtTokenProvider.generateToken(userDetails);

        return new JwtAuthResponse(jwt);

    }

    @Override
    public void createUser(RegisterRequestDto registerRequestDto) {

        //check the user exist or not
        boolean userExists = userRepository.existsByEmail(registerRequestDto.getEmail());
        if(userExists) {
            throw new UserAlreadyExistException("User already registered with email: "+ registerRequestDto.getEmail());
        }

        //get office by id
        OfficeLocation office = officeLocationRepository.findById(registerRequestDto.getOfficeId())
                .orElseThrow(() -> new OfficeNotFoundException("Office not found with id: " + registerRequestDto.getOfficeId()));

        //save new User
        User newUser = User.builder()
                .email(registerRequestDto.getEmail())
                .password(passwordEncoder.encode(registerRequestDto.getPassword()))
                .username(registerRequestDto.getUsername())
                .assignedOffice(office)
                .role(Role.USER_ROLE)
                .build();

        userRepository.save(newUser);

    }
}
