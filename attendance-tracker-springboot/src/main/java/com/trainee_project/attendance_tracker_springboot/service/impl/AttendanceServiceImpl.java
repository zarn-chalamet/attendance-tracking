package com.trainee_project.attendance_tracker_springboot.service.impl;

import com.trainee_project.attendance_tracker_springboot.dto.*;
import com.trainee_project.attendance_tracker_springboot.exception.SessionWindowNotFoundException;
import com.trainee_project.attendance_tracker_springboot.model.*;
import com.trainee_project.attendance_tracker_springboot.repository.AttendanceRecordRepository;
import com.trainee_project.attendance_tracker_springboot.repository.OfficeLocationRepository;
import com.trainee_project.attendance_tracker_springboot.repository.SessionWindowRepository;
import com.trainee_project.attendance_tracker_springboot.repository.UserRepository;
import com.trainee_project.attendance_tracker_springboot.service.AttendanceService;
import com.trainee_project.attendance_tracker_springboot.service.FaceRecognitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final UserRepository userRepository;
    private final SessionWindowRepository sessionWindowRepository;
    private final FaceRecognitionService faceRecognitionService;

    @Override
    @Transactional
    public AttendanceRecordDto clockIn(String email, MultipartFile file, SessionType sessionType, double lat, double lng) throws IOException {

        //get user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        //get office
        OfficeLocation office = user.getAssignedOffice();
        if (office == null) {
            throw new IllegalStateException("User has no assigned office location");
        }

        //get session window by session type
        SessionWindow session = sessionWindowRepository.findBySessionType(sessionType)
                .orElseThrow(() -> new SessionWindowNotFoundException("Session window not found with session type: "+sessionType));

        LocalTime nowTime = LocalTime.now();
        if(nowTime.isBefore(session.getStartTime()) || nowTime.isAfter(session.getEndTime())) {
            throw new IllegalArgumentException("Not in session time window.");
        }

        // prevent duplicate clock-in for same session & day
        LocalDate today = LocalDate.now();
        LocalDateTime dayStart = today.atStartOfDay();
        LocalDateTime dayEnd = today.atTime(LocalTime.MAX);


        Optional<AttendanceRecord> existingOpen = attendanceRecordRepository
                .findTopByUserAndSessionTypeAndClockInTimeBetweenOrderByClockInTimeDesc(
                        user, sessionType, dayStart, dayEnd);


        if (existingOpen.isPresent() && existingOpen.get().getClockOutTime() == null) {
            throw new IllegalStateException("Already clocked in for this session and not clocked out yet.");
        }

        //face check
        byte[] referenceImage = Files.readAllBytes(Paths.get(user.getFaceUrl()));
        byte[] liveImage = file.getBytes();

        FaceVerificationResponseDto faceResponse = faceRecognitionService.verifyFace(referenceImage, liveImage);

        if (!faceResponse.isVerified()) {
            throw new IllegalStateException("Face verification failed. Confidence: " + faceResponse.getConfidence());
        }

        //save
        AttendanceRecord record = AttendanceRecord.builder()
                .user(user)
                .sessionType(sessionType)
                .clockInTime(LocalDateTime.now())
                .clockInLat(lat)
                .clockInLng(lng)
                .faceMatchScore(faceResponse.getConfidence())
                .status("OK")
                .build();
        AttendanceRecord savedRecord = attendanceRecordRepository.save(record);

        return AttendanceRecordDto.builder()
                .id(savedRecord.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .officeName(office.getName())
                .sessionType(savedRecord.getSessionType().toString())
                .clockInTime(savedRecord.getClockInTime())
                .clockInLat(savedRecord.getClockInLat())
                .clockInLng(savedRecord.getClockInLng())
                .status(savedRecord.getStatus())
                .build();
    }

    @Override
    @Transactional
    public AttendanceRecordDto clockOut(String email, MultipartFile file, SessionType sessionType, double lat, double lng) throws IOException {

        //get user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        //get office
        OfficeLocation office = user.getAssignedOffice();
        if (office == null) {
            throw new IllegalStateException("User has no assigned office location");
        }

        //get session window by session type
        SessionWindow session = sessionWindowRepository.findBySessionType(sessionType)
                .orElseThrow(() -> new SessionWindowNotFoundException("Session window not found with session type: "+sessionType));

        LocalTime nowTime = LocalTime.now();
        if(nowTime.isBefore(session.getStartTime()) || nowTime.isAfter(session.getEndTime())) {
            throw new IllegalArgumentException("Not in session time window.");
        }

        //find the latest attendance record for this user/session today
        LocalDate today = LocalDate.now();
        LocalDateTime dayStart = today.atStartOfDay();
        LocalDateTime dayEnd = today.atTime(LocalTime.MAX);


        Optional<AttendanceRecord> existingOpt = attendanceRecordRepository
                .findTopByUserAndSessionTypeAndClockInTimeBetweenOrderByClockInTimeDesc(
                        user, sessionType, dayStart, dayEnd);


        if (existingOpt.isEmpty()) {
            throw new IllegalStateException("No clock-in record found for this session today.");
        }


        AttendanceRecord record = existingOpt.get();
        if (record.getClockOutTime() != null) {
            throw new IllegalStateException("Already clocked out for this session.");
        }

        //face check
        byte[] referenceImage = Files.readAllBytes(Paths.get(user.getFaceUrl()));
        byte[] liveImage = file.getBytes();

        FaceVerificationResponseDto faceResponse = faceRecognitionService.verifyFace(referenceImage, liveImage);

        if (!faceResponse.isVerified()) {
            throw new IllegalStateException("Face verification failed. Confidence: " + faceResponse.getConfidence());
        }

        // update record
        record.setClockOutTime(LocalDateTime.now());
        record.setClockOutLat(lat);
        record.setClockOutLng(lng);

        AttendanceRecord savedRecord = attendanceRecordRepository.save(record);

        return AttendanceRecordDto.builder()
                .id(savedRecord.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .officeName(office.getName())
                .sessionType(savedRecord.getSessionType().toString())
                .clockInTime(savedRecord.getClockInTime())
                .clockOutTime(savedRecord.getClockOutTime())
                .clockInLat(savedRecord.getClockInLat())
                .clockInLng(savedRecord.getClockInLng())
                .clockOutLat(savedRecord.getClockOutLat())
                .clockOutLng(savedRecord.getClockOutLng())
                .status(savedRecord.getStatus())
                .build();
    }

    @Override
    public LocationVerifyResponseDto verifyLocation(String email, LocationVerifyRequestDto request) {

        //get user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        //get office
        OfficeLocation office = user.getAssignedOffice();
        if (office == null) {
            throw new IllegalStateException("User has no assigned office location");
        }
        System.out.println("==================");
        System.out.println(office.getRadiusMeters());


        double distance = haversine(request.getLat(), request.getLng(),
                office.getLatitude(), office.getLongitude());

        return LocationVerifyResponseDto.builder()
                .withinRadius(distance <= office.getRadiusMeters())
                .radiusMeters(office.getRadiusMeters())
                .build();
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371000; // meters

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // distance in meters
    }

}
