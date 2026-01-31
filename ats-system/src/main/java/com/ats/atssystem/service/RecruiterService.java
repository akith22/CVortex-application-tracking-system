package com.ats.atssystem.service;

import com.ats.atssystem.dto.RecruiterProfileResponse;

public interface RecruiterService {

    RecruiterProfileResponse getMyProfile();

    void updateMyName(String name);
}
