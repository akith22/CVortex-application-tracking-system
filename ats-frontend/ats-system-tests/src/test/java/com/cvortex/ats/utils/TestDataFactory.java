package com.cvortex.ats.utils;

import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.models.JobData;
import com.cvortex.ats.models.UserData;
import com.fasterxml.jackson.core.type.TypeReference;
import com.github.javafaker.Faker;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

public final class TestDataFactory {

    private static final Faker FAKER = new Faker(Locale.ENGLISH);

    private TestDataFactory() {
    }

    public static List<UserData> getUsers() {
        return JsonDataReader.readList(FrameworkConstants.USERS_JSON, new TypeReference<List<UserData>>() { });
    }

    public static List<JobData> getJobs() {
        return JsonDataReader.readList(FrameworkConstants.JOBS_JSON, new TypeReference<List<JobData>>() { });
    }

    public static UserData buildUniqueCandidate() {
        String uniqueToken = UUID.randomUUID().toString().substring(0, 8);
        return UserData.builder()
                .name(FAKER.name().fullName())
                .email("candidate." + uniqueToken + "@cvortex.test")
                .password("Qa@12345")
                .role("CANDIDATE")
                .build();
    }

    public static JobData buildUniqueJob() {
        return JobData.builder()
                .title("Automation QA Engineer " + UUID.randomUUID().toString().substring(0, 6))
                .location(FAKER.address().cityName())
                .type("Full-time")
                .description("Automation-created job for end-to-end system testing.")
                .status("OPEN")
                .build();
    }
}
