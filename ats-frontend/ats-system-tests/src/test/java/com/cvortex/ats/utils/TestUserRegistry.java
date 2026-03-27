package com.cvortex.ats.utils;

import com.cvortex.ats.enums.UserRole;
import com.cvortex.ats.models.UserData;

public final class TestUserRegistry {

    private TestUserRegistry() {
    }

    public static UserData getByRole(UserRole role) {
        return TestSessionContext.getOrCreateUser(role);
    }

    public static UserData[] getAllRoles() {
        return TestSessionContext.getAllRoleUsers();
    }
}
