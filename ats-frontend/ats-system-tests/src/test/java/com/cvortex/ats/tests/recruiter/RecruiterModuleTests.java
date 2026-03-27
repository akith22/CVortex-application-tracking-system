package com.cvortex.ats.tests.recruiter;

import com.cvortex.ats.base.BaseTest;
import com.cvortex.ats.config.ConfigReader;
import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.enums.UserRole;
import com.cvortex.ats.models.JobData;
import com.cvortex.ats.models.SeededJobData;
import com.cvortex.ats.models.UserData;
import com.cvortex.ats.pages.auth.LoginPage;
import com.cvortex.ats.pages.common.ProtectedRouteHelper;
import com.cvortex.ats.pages.recruiter.ApplicantsPage;
import com.cvortex.ats.pages.recruiter.CreateEditJobPage;
import com.cvortex.ats.pages.recruiter.JobManagementPage;
import com.cvortex.ats.pages.recruiter.RecruiterDashboardPage;
import com.cvortex.ats.pages.recruiter.RecruiterProfilePage;
import com.cvortex.ats.pages.recruiter.ResumeViewPage;
import com.cvortex.ats.utils.AssertionUtil;
import com.cvortex.ats.utils.BackendBootstrapUtil;
import com.cvortex.ats.utils.TestDataFactory;
import com.cvortex.ats.utils.TestUserRegistry;
import com.cvortex.ats.utils.WaitUtil;
import org.testng.Assert;
import org.testng.annotations.Test;

public class RecruiterModuleTests extends BaseTest {

    private static String createdJobTitle;

    @Test(groups = {"smoke", "regression", "system", "recruiter"}, description = "View recruiter dashboard")
    public void shouldViewRecruiterDashboard() {
        RecruiterDashboardPage dashboardPage = loginAsRecruiter();
        Assert.assertTrue(dashboardPage.isAt(), "Recruiter dashboard should load.");
    }

    @Test(groups = {"smoke", "regression", "system", "recruiter"}, description = "Create job vacancy with valid data")
    public void shouldCreateJobVacancyWithValidData() {
        RecruiterDashboardPage dashboardPage = loginAsRecruiter();
        JobData jobData = TestDataFactory.buildUniqueJob();
        createdJobTitle = jobData.getTitle();
        dashboardPage.createJob(jobData);
        AssertionUtil.assertContains(dashboardPage.getSuccessMessage(), "Job posted successfully", "Creating a job should show success feedback.");
    }

    @Test(groups = {"regression", "system", "recruiter"}, description = "Validate required field errors in job creation")
    public void shouldValidateRequiredFieldsInJobCreation() {
        RecruiterDashboardPage dashboardPage = loginAsRecruiter();
        CreateEditJobPage createEditJobPage = dashboardPage.openCreateJobModal();
        createEditJobPage.createJobWithoutRequiredFields();
        AssertionUtil.assertContains(dashboardPage.getErrorMessage(), "fill in all required fields", "Empty job form should be rejected.");
    }

    @Test(groups = {"regression", "system", "recruiter"}, description = "Edit/update job details using current management surface")
    public void shouldExposeCreatedJobInJobManagementForUpdate() {
        ensureRecruiterJobBaseline();
        loginAsRecruiter().navigation().clickLink("/recruiter/jobs");
        JobManagementPage jobManagementPage = new JobManagementPage(driver);
        String targetJob = createdJobTitle == null ? jobManagementPage.getFirstJobTitle() : createdJobTitle;
        Assert.assertTrue(jobManagementPage.hasJob(targetJob), "Created job should be visible in recruiter job management.");
        jobManagementPage.updateStatus(targetJob, "OPEN");
        AssertionUtil.assertContains(jobManagementPage.getStatus(targetJob), "OPEN", "Current UI should allow updating the job state from the management surface.");
    }

    @Test(groups = {"regression", "system", "recruiter"}, description = "Change job status OPEN to CLOSED")
    public void shouldChangeJobStatusFromOpenToClosed() {
        ensureRecruiterJobBaseline();
        loginAsRecruiter().navigation().clickLink("/recruiter/jobs");
        JobManagementPage jobManagementPage = new JobManagementPage(driver);
        String targetJob = createdJobTitle == null ? jobManagementPage.getFirstJobTitle() : createdJobTitle;
        jobManagementPage.updateStatus(targetJob, "CLOSED");
        AssertionUtil.assertContains(jobManagementPage.getStatus(targetJob), "CLOSED", "Recruiter should be able to close a job vacancy.");
    }

    @Test(groups = {"regression", "system", "recruiter"}, description = "View applicants for a job")
    public void shouldViewApplicantsForAJob() {
        ensureApplicantBaseline();
        loginAsRecruiter().navigation().clickLink("/recruiter/applications");
        ApplicantsPage applicantsPage = new ApplicantsPage(driver);
        String jobTitle = applicantsPage.getFirstJobTitle();
        Assert.assertTrue(applicantsPage.isAt(), "Recruiter applications page should load.");
        Assert.assertTrue(applicantsPage.hasApplicantsForJob(jobTitle), "Recruiter should see a job section on the applicants page.");
    }

    @Test(groups = {"regression", "system", "recruiter"}, description = "Open candidate resume")
    public void shouldOpenCandidateResume() {
        ensureApplicantBaseline();
        loginAsRecruiter().navigation().clickLink("/recruiter/applications");
        ApplicantsPage applicantsPage = new ApplicantsPage(driver);
        String jobTitle = applicantsPage.getFirstJobTitle();
        applicantsPage.openFirstApplicantDetails(jobTitle);
        Assert.assertTrue(applicantsPage.isApplicantModalOpen(), "Applicant details modal should open.");
        Assert.assertTrue(applicantsPage.isResumeAvailableInModal(), "Applicant resume button should be available.");
        applicantsPage.openResumeFromModal();
        ResumeViewPage resumeViewPage = new ResumeViewPage(driver);
        resumeViewPage.switchToLatestTab();
        Assert.assertTrue(resumeViewPage.isResumeTabOpen(), "Resume should open in a new browser tab or blob URL.");
    }

    @Test(groups = {"regression", "system", "recruiter"}, description = "Update application status")
    public void shouldUpdateApplicationStatus() {
        ensureApplicantBaseline();
        loginAsRecruiter().navigation().clickLink("/recruiter/applications");
        ApplicantsPage applicantsPage = new ApplicantsPage(driver);
        String jobTitle = applicantsPage.getFirstJobTitle();
        String applicantEmail = applicantsPage.getFirstApplicantEmail();
        applicantsPage.updateApplicationStatusFromCard(jobTitle, applicantEmail, "SHORTLISTED");
        AssertionUtil.assertContains(applicantsPage.getApplicantStatusFromCard(jobTitle, applicantEmail), "SHORTLISTED", "Recruiter should be able to update the applicant status.");
    }

    @Test(groups = {"regression", "system", "recruiter", "access"}, description = "Verify recruiter cannot access admin-only pages")
    public void shouldBlockRecruiterFromAdminOnlyPages() {
        loginAsRecruiter();
        ProtectedRouteHelper protectedRouteHelper = new ProtectedRouteHelper(driver);
        protectedRouteHelper.openProtectedPath("/admin/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Recruiter should be redirected away from admin dashboard.");
    }

    @Test(groups = {"regression", "system", "recruiter"}, description = "Update recruiter profile successfully")
    public void shouldUpdateRecruiterProfileSuccessfully() {
        RecruiterDashboardPage dashboardPage = loginAsRecruiter();
        RecruiterProfilePage profilePage = dashboardPage.openProfile();
        profilePage.updateName(ConfigReader.get("recruiter.profile.updated.name"));
        AssertionUtil.assertContains(dashboardPage.getSuccessMessage(), "updated successfully", "Recruiter profile save should show success feedback.");
    }

    private void ensureApplicantBaseline() {
        BackendBootstrapUtil.ensureCandidateApplication(
                TestUserRegistry.getByRole(UserRole.CANDIDATE),
                TestUserRegistry.getByRole(UserRole.RECRUITER)
        );
    }

    private void ensureRecruiterJobBaseline() {
        SeededJobData seededJobData = BackendBootstrapUtil.ensureOpenJob(TestUserRegistry.getByRole(UserRole.RECRUITER));
        if (createdJobTitle == null) {
            createdJobTitle = seededJobData.getTitle();
        }
    }

    private RecruiterDashboardPage loginAsRecruiter() {
        UserData recruiter = TestUserRegistry.getByRole(UserRole.RECRUITER);
        BackendBootstrapUtil.ensureUserRegistered(recruiter);
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(recruiter);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/recruiter/dashboard");
        return new RecruiterDashboardPage(driver);
    }
}
