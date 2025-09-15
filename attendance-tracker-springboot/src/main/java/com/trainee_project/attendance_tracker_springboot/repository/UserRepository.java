package com.trainee_project.attendance_tracker_springboot.repository;

import com.trainee_project.attendance_tracker_springboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}
