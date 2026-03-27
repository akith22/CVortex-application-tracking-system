package com.cvortex.ats.utils;

import com.cvortex.ats.enums.UserRole;
import com.cvortex.ats.models.UserData;

import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class TestSessionContext {

    private static final String RUN_ID = Long.toString(System.currentTimeMillis(), 36);
    private static final Map<UserRole, UserData> ROLE_USERS = new ConcurrentHashMap<>();

    private TestSessionContext() {
    }

    public static UserData getOrCreateUser(UserRole role) {
        return ROLE_USERS.computeIfAbsent(role, TestSessionContext::buildUser);
    }

    public static UserData[] getAllRoleUsers() {
        return Arrays.stream(UserRole.values())
                .map(TestSessionContext::getOrCreateUser)
                .toArray(UserData[]::new);
    }

    private static UserData buildUser(UserRole role) {
        String email = switch (role) {
            case ADMIN -> "adm." + RUN_ID + "@cvx.test";
            case RECRUITER -> "rec." + RUN_ID + "@cvx.test";
            case CANDIDATE -> "can." + RUN_ID + "@cvx.test";
        };
        String password = switch (role) {
            case ADMIN -> "Admin@123";
            case RECRUITER -> "Recruiter@123";
            case CANDIDATE -> "Candidate@123";
        };
        String name = switch (role) {
            case ADMIN -> "Automation Admin";
            case RECRUITER -> "Automation Recruiter";
            case CANDIDATE -> "Automation Candidate";
        };
        return UserData.builder()
                .name(name)
                .email(email)
                .password(password)
                .role(role.name())
                .build();
    }
}
