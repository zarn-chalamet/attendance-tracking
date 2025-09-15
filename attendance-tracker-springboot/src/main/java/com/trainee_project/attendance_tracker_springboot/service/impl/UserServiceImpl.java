package com.trainee_project.attendance_tracker_springboot.service.impl;

import com.trainee_project.attendance_tracker_springboot.dto.UserResponseDto;
import com.trainee_project.attendance_tracker_springboot.mapper.UserMapper;
import com.trainee_project.attendance_tracker_springboot.model.User;
import com.trainee_project.attendance_tracker_springboot.repository.UserRepository;
import com.trainee_project.attendance_tracker_springboot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponseDto> getUserList(String email) {

        List<User> users = userRepository.findAll();

        return users.stream()
                .map(UserMapper::mapToDto)
                .toList();
    }

    @Override
    public UserResponseDto getUserById(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: "+userId));

        return UserMapper.mapToDto(user);
    }

    @Override
    public UserResponseDto updateFaceEmbeddingJson(String userId, String faceEmbeddingJson) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: "+userId));

        user.setFaceEmbeddingJson(faceEmbeddingJson);
        userRepository.save(user);

        return UserMapper.mapToDto(user);
    }

    @Override
    public UserResponseDto getUserProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+ email));

        return UserMapper.mapToDto(user);
    }
}
