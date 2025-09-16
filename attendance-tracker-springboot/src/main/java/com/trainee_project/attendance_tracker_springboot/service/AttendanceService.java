package com.trainee_project.attendance_tracker_springboot.service;

import com.trainee_project.attendance_tracker_springboot.dto.AttendanceRecordDto;
import com.trainee_project.attendance_tracker_springboot.dto.ClockRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.LocationVerifyRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.LocationVerifyResponseDto;
import com.trainee_project.attendance_tracker_springboot.model.SessionType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AttendanceService {

    AttendanceRecordDto clockIn(String email, MultipartFile file, SessionType sessionType, double lat, double lng) throws IOException;

    AttendanceRecordDto clockOut(String email, MultipartFile file, SessionType sessionType, double lat, double lng) throws IOException;

    LocationVerifyResponseDto verifyLocation(String email, LocationVerifyRequestDto request);

}
