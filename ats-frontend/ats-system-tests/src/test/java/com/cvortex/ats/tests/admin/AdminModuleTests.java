package com.cvortex.ats.tests.admin;

import com.cvortex.ats.base.BaseTest;
import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.enums.UserRole;
import com.cvortex.ats.models.UserData;
import com.cvortex.ats.pages.admin.AdminDashboardPage;
import com.cvortex.ats.pages.admin.AdminJobsPage;
import com.cvortex.ats.pages.admin.AdminStatisticsPage;
import com.cvortex.ats.pages.admin.AdminUsersPage;
import com.cvortex.ats.pages.auth.LoginPage;
import com.cvortex.ats.pages.common.ProtectedRouteHelper;
import com.cvortex.ats.utils.AssertionUtil;
import com.cvortex.ats.utils.BackendBootstrapUtil;
import com.cvortex.ats.utils.TestUserRegistry;
import com.cvortex.ats.utils.WaitUtil;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AdminModuleTests extends BaseTest {

    @Test(groups = {"smoke", "regression", "system", "admin"}, description = "View admin dashboard")
    public void shouldViewAdminDashboard() {
        AdminDashboardPage dashboardPage = loginAsAdmin();
        Assert.assertTrue(dashboardPage.isAt(), "Admin dashboard should load.");
        Assert.assertTrue(dashboardPage.isStatisticsCardVisible("Total Users"), "Admin dashboard should display statistics cards.");
    }

    @Test(groups = {"smoke", "regression", "system", "admin"}, description = "View all users")
    public void shouldViewAllUsers() {
        loginAsAdmin();
        AdminUsersPage usersPage = new AdminUsersPage(driver);
        Assert.assertTrue(usersPage.getUserCount() > 0, "Admin should see at least one user row.");
        Assert.assertTrue(usersPage.hasUser(TestUserRegistry.getByRole(UserRole.CANDIDATE).getEmail()), "Admin users table should contain the bootstrap candidate.");
    }

    @Test(groups = {"smoke", "regression", "system", "admin"}, description = "View all jobs")
    public void shouldViewAllJobs() {
        loginAsAdmin();
        AdminJobsPage jobsPage = new AdminJobsPage(driver);
        Assert.assertTrue(jobsPage.getJobCount() > 0, "Admin should see at least one job row.");
    }

    @Test(groups = {"regression", "system", "admin"}, description = "Validate platform statistics widgets and tables")
    public void shouldValidateAdminStatisticsWidgets() {
        loginAsAdmin();
        AdminStatisticsPage statisticsPage = new AdminStatisticsPage(driver);
        AssertionUtil.assertNotBlank(statisticsPage.getTotalUsers(), "Total users metric should be populated.");
        AssertionUtil.assertNotBlank(statisticsPage.getRecruiterCount(), "Recruiters metric should be populated.");
        AssertionUtil.assertNotBlank(statisticsPage.getCandidateCount(), "Candidates metric should be populated.");
        AssertionUtil.assertNotBlank(statisticsPage.getTotalJobs(), "Total jobs metric should be populated.");
    }

    @Test(groups = {"regression", "system", "admin", "access"}, description = "Verify admin access control works properly")
    public void shouldValidateAdminAccessControl() {
        loginAsAdmin();
        ProtectedRouteHelper protectedRouteHelper = new ProtectedRouteHelper(driver);
        protectedRouteHelper.openProtectedPath("/candidate/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Admin should be redirected away from candidate-only pages.");
        loginAsAdmin();
        protectedRouteHelper.openProtectedPath("/recruiter/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Admin should be redirected away from recruiter-only pages.");
    }

    private AdminDashboardPage loginAsAdmin() {
        UserData admin = TestUserRegistry.getByRole(UserRole.ADMIN);
        BackendBootstrapUtil.ensureAdminViewData(
                admin,
                TestUserRegistry.getByRole(UserRole.RECRUITER),
                TestUserRegistry.getByRole(UserRole.CANDIDATE)
        );
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(admin);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/admin/dashboard");
        return new AdminDashboardPage(driver);
    }
}
