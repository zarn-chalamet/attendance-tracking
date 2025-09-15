package com.trainee_project.attendance_tracker_springboot.service.impl;

import com.trainee_project.attendance_tracker_springboot.dto.OfficeLocationRequestDto;
import com.trainee_project.attendance_tracker_springboot.dto.OfficeLocationResponseDto;
import com.trainee_project.attendance_tracker_springboot.exception.OfficeAlreadyRegisteredException;
import com.trainee_project.attendance_tracker_springboot.exception.OfficeNotFoundException;
import com.trainee_project.attendance_tracker_springboot.mapper.OfficeLocationMapper;
import com.trainee_project.attendance_tracker_springboot.model.OfficeLocation;
import com.trainee_project.attendance_tracker_springboot.repository.OfficeLocationRepository;
import com.trainee_project.attendance_tracker_springboot.service.OfficeLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficeLocationServiceImpl implements OfficeLocationService {

    private final OfficeLocationRepository officeLocationRepository;

    @Override
    public OfficeLocationResponseDto createOffice(OfficeLocationRequestDto request) {

        //check office is already or not
        boolean officeExists = officeLocationRepository.existsByName(request.getName());
        if(officeExists) {
            throw new OfficeAlreadyRegisteredException("Office is already created  with name: "+request.getName());
        }

        //save office to database
        OfficeLocation office = OfficeLocation.builder()
                .name(request.getName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
        OfficeLocation createdOffice = officeLocationRepository.save(office);

        return OfficeLocationMapper.mapToDto(createdOffice);
    }

    @Override
    public List<OfficeLocationResponseDto> getOfficeLists() {

        //get office lists
        List<OfficeLocation> offices = officeLocationRepository.findAll();

        return offices.stream()
                .map(OfficeLocationMapper::mapToDto)
                .toList();
    }

    @Override
    public OfficeLocationResponseDto getOfficeById(String officeId) {

        //get office by id
        OfficeLocation office = officeLocationRepository.findById(officeId)
                .orElseThrow(() -> new OfficeNotFoundException("Office not found with id: "+ officeId));

        return OfficeLocationMapper.mapToDto(office);
    }

    @Override
    public OfficeLocationResponseDto updateOfficeById(String officeId, OfficeLocationRequestDto request) {

        //get office by id
        OfficeLocation office = officeLocationRepository.findById(officeId)
                .orElseThrow(() -> new OfficeNotFoundException("Office not found with id: "+ officeId));

        if(request.getName() != null) {
            office.setName(request.getName());
        }

        if(request.getLatitude() != 0.0) {
            office.setLatitude(request.getLatitude());
        }

        if(request.getLongitude() != 0.0) {
            office.setLongitude(request.getLongitude());
        }
        officeLocationRepository.save(office);

        return OfficeLocationMapper.mapToDto(office);
    }

    @Override
    public void deleteOfficeById(String officeId) {

        //get office by id
        OfficeLocation office = officeLocationRepository.findById(officeId)
                .orElseThrow(() -> new OfficeNotFoundException("Office not found with id: "+ officeId));

        officeLocationRepository.delete(office);
    }
}
