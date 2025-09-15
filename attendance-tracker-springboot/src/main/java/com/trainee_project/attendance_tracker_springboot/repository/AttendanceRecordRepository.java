package com.trainee_project.attendance_tracker_springboot.repository;

import com.trainee_project.attendance_tracker_springboot.model.AttendanceRecord;
import com.trainee_project.attendance_tracker_springboot.model.SessionType;
import com.trainee_project.attendance_tracker_springboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, String> {
    Optional<AttendanceRecord> findTopByUserAndSessionTypeAndClockInTimeBetweenOrderByClockInTimeDesc(User user, SessionType sessionType, LocalDateTime dayStart, LocalDateTime dayEnd);
}
