package com.cvortex.ats.dataproviders;

import com.cvortex.ats.models.JobData;
import com.cvortex.ats.models.UserData;
import com.cvortex.ats.utils.TestDataFactory;
import com.cvortex.ats.utils.TestUserRegistry;
import org.testng.annotations.DataProvider;

import java.util.List;
import java.util.stream.Collectors;

public class TestDataProviders {

    @DataProvider(name = "roleCredentials")
    public Object[][] roleCredentials() {
        UserData[] users = TestUserRegistry.getAllRoles();
        Object[][] data = new Object[users.length][1];
        for (int index = 0; index < users.length; index++) {
            data[index][0] = users[index];
        }
        return data;
    }

    @DataProvider(name = "jobData")
    public Object[][] jobData() {
        List<JobData> jobs = TestDataFactory.getJobs().stream().collect(Collectors.toList());
        return jobs.stream().map(job -> new Object[]{job}).toArray(Object[][]::new);
    }
}
