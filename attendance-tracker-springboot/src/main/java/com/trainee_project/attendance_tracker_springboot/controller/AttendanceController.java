package com.trainee_project.attendance_tracker_springboot.controller;

import com.trainee_project.attendance_tracker_springboot.dto.AttendanceRecordDto;
import com.trainee_project.attendance_tracker_springboot.dto.ClockRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.LocationVerifyRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.LocationVerifyResponseDto;
import com.trainee_project.attendance_tracker_springboot.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/v1/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/clock-in")
    public ResponseEntity<AttendanceRecordDto> clockIn(@RequestBody ClockRequestDto request,
                                                       Principal principal) {

        String email = principal.getName();
        AttendanceRecordDto record = attendanceService.clockIn(email, request);

        return ResponseEntity.ok(record);
    }

    @PostMapping("/clock-out")
    public ResponseEntity<AttendanceRecordDto> clockOut(@RequestBody ClockRequestDto request,
                                                       Principal principal) {

        String email = principal.getName();
        AttendanceRecordDto record = attendanceService.clockOut(email, request);

        return ResponseEntity.ok(record);
    }

    //verify location according to the user's office location(200 meter)
    @PostMapping("/verify")
    public ResponseEntity<LocationVerifyResponseDto> verifyLocation(@RequestBody LocationVerifyRequestDto request,
                                                                    Principal principal) {
        String email = principal.getName();
        LocationVerifyResponseDto verification = attendanceService.verifyLocation(email, request);

        return ResponseEntity.ok(verification);
    }
}
