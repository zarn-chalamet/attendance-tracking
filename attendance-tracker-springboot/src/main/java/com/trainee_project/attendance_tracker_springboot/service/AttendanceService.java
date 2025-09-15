package com.trainee_project.attendance_tracker_springboot.service;

import com.trainee_project.attendance_tracker_springboot.dto.AttendanceRecordDto;
import com.trainee_project.attendance_tracker_springboot.dto.ClockRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.LocationVerifyRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.LocationVerifyResponseDto;

public interface AttendanceService {
    AttendanceRecordDto clockIn(String email, ClockRequestDto request);

    AttendanceRecordDto clockOut(String email, ClockRequestDto request);

    LocationVerifyResponseDto verifyLocation(String email, LocationVerifyRequestDto request);
}
