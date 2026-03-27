package com.cvortex.ats.tests.candidate;

import com.cvortex.ats.base.BaseTest;
import com.cvortex.ats.config.ConfigReader;
import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.enums.UserRole;
import com.cvortex.ats.models.UserData;
import com.cvortex.ats.pages.auth.LoginPage;
import com.cvortex.ats.pages.candidate.CandidateApplicationPage;
import com.cvortex.ats.pages.candidate.CandidateDashboardPage;
import com.cvortex.ats.pages.candidate.CandidateJobsPage;
import com.cvortex.ats.pages.candidate.CandidateProfilePage;
import com.cvortex.ats.pages.candidate.ResumeUploadPage;
import com.cvortex.ats.pages.common.ProtectedRouteHelper;
import com.cvortex.ats.utils.AssertionUtil;
import com.cvortex.ats.utils.BackendBootstrapUtil;
import com.cvortex.ats.utils.TestUserRegistry;
import com.cvortex.ats.utils.WaitUtil;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.nio.file.Path;

public class CandidateModuleTests extends BaseTest {

    private static String appliedJobTitle;

    @Test(groups = {"smoke", "regression", "system", "candidate"}, description = "View candidate dashboard")
    public void shouldViewCandidateDashboard() {
        CandidateDashboardPage dashboardPage = loginAsCandidate(false);
        Assert.assertTrue(dashboardPage.isAt(), "Candidate dashboard should load.");
        AssertionUtil.assertContains(dashboardPage.getWelcomeMessage(), "Welcome back", "Dashboard welcome header should be visible.");
    }

    @Test(groups = {"regression", "system", "candidate"}, description = "Update profile successfully")
    public void shouldUpdateCandidateProfileSuccessfully() {
        CandidateDashboardPage dashboardPage = loginAsCandidate(false);
        CandidateProfilePage profilePage = dashboardPage.openProfile();
        profilePage.updateName(ConfigReader.get("candidate.profile.updated.name"));
        AssertionUtil.assertContains(dashboardPage.getSuccessMessage(), "updated successfully", "Profile update should show success feedback.");
    }

    @Test(groups = {"regression", "system", "candidate"}, description = "Validate profile form errors")
    public void shouldValidateCandidateProfileErrors() {
        CandidateDashboardPage dashboardPage = loginAsCandidate(false);
        CandidateProfilePage profilePage = dashboardPage.openProfile();
        profilePage.updateName("   ");
        AssertionUtil.assertContains(dashboardPage.getErrorMessage(), "Name cannot be empty", "Blank profile name should be rejected.");
    }

    @Test(groups = {"smoke", "regression", "system", "candidate"}, description = "View available jobs")
    public void shouldViewAvailableJobs() {
        CandidateDashboardPage dashboardPage = loginAsCandidate(true);
        dashboardPage.openJobs();
        CandidateJobsPage jobsPage = new CandidateJobsPage(driver);
        Assert.assertTrue(jobsPage.isAt(), "Candidate jobs page should load.");
        Assert.assertTrue(jobsPage.getAvailableJobCount() > 0, "At least one open job is expected for candidate job browsing tests.");
    }

    @Test(groups = {"regression", "system", "candidate"}, description = "Apply for an open job")
    public void shouldApplyForAnOpenJob() {
        CandidateDashboardPage dashboardPage = loginAsCandidate(true);
        dashboardPage.openJobs();
        CandidateJobsPage jobsPage = new CandidateJobsPage(driver);
        appliedJobTitle = jobsPage.getFirstJobTitle();
        jobsPage.openJobDetailsByTitle(appliedJobTitle);
        Assert.assertTrue(jobsPage.isJobDetailsModalOpen(), "Job details modal should open before applying.");
        jobsPage.clickApplyNow();

        CandidateApplicationPage applicationPage = new CandidateApplicationPage(driver);
        Assert.assertTrue(applicationPage.isApplyModalOpen(), "Apply modal should open on the applications page.");
        applicationPage.submitApplication(Path.of(FrameworkConstants.TEST_FILES_DIR.toString(), ConfigReader.get("sample.resume.file")));
        AssertionUtil.assertContains(applicationPage.getSuccessMessage(), "Successfully applied", "Successful application should show confirmation.");
        Assert.assertTrue(applicationPage.hasAnyApplication(), "Applications list should contain at least one application after apply.");
    }

    @Test(groups = {"regression", "system", "candidate"}, description = "Prevent duplicate application if system supports it")
    public void shouldPreventDuplicateApplication() {
        BackendBootstrapUtil.ensureCandidateApplication(TestUserRegistry.getByRole(UserRole.CANDIDATE), TestUserRegistry.getByRole(UserRole.RECRUITER));
        CandidateDashboardPage dashboardPage = loginAsCandidate(true);
        dashboardPage.openJobs();
        CandidateJobsPage jobsPage = new CandidateJobsPage(driver);
        String targetJob = appliedJobTitle == null ? jobsPage.getFirstJobTitle() : appliedJobTitle;
        jobsPage.openJobDetailsByTitle(targetJob);
        jobsPage.clickApplyNow();

        CandidateApplicationPage applicationPage = new CandidateApplicationPage(driver);
        applicationPage.submitApplication(Path.of(FrameworkConstants.TEST_FILES_DIR.toString(), ConfigReader.get("sample.resume.file")));
        AssertionUtil.assertNotBlank(applicationPage.getErrorMessage(), "Duplicate application flow should return an error when the same candidate re-applies.");
    }

    @Test(groups = {"regression", "system", "candidate"}, description = "Upload resume successfully")
    public void shouldUploadResumeSuccessfullyOnResumePage() {
        loginAsCandidate(false);
        driver.get(ConfigReader.get("frontend.base.url") + "/candidate/resume");
        ResumeUploadPage resumeUploadPage = new ResumeUploadPage(driver);
        resumeUploadPage.upload(Path.of(FrameworkConstants.TEST_FILES_DIR.toString(), ConfigReader.get("sample.resume.file")));
        AssertionUtil.assertContains(resumeUploadPage.getSelectedFileText(), ConfigReader.get("sample.resume.file"), "Selected resume file name should be shown on the page.");
    }

    @Test(groups = {"regression", "system", "candidate"}, description = "Validate unsupported and empty resume upload")
    public void shouldValidateUnsupportedAndEmptyResumeUpload() {
        CandidateDashboardPage dashboardPage = loginAsCandidate(true);
        dashboardPage.openJobs();
        CandidateJobsPage jobsPage = new CandidateJobsPage(driver);
        jobsPage.openFirstJobDetails();
        jobsPage.clickApplyNow();

        CandidateApplicationPage applicationPage = new CandidateApplicationPage(driver);
        Assert.assertTrue(applicationPage.isSubmitButtonDisabled(), "Submit should stay disabled until a resume is selected.");

        jobsPage.navigation().clickLink("/candidate/jobs");
        jobsPage.openFirstJobDetails();
        jobsPage.clickApplyNow();
        applicationPage.uploadResume(Path.of(FrameworkConstants.TEST_FILES_DIR.toString(), ConfigReader.get("invalid.resume.file")));
        AssertionUtil.assertContains(applicationPage.getErrorMessage(), "PDF", "Non-PDF resume uploads should be rejected.");
        Assert.assertTrue(applicationPage.isSubmitButtonDisabled(), "Submit should remain disabled after an invalid file is rejected.");
    }

    @Test(groups = {"regression", "system", "candidate"}, description = "Track submitted application status")
    public void shouldTrackSubmittedApplicationStatus() {
        BackendBootstrapUtil.ensureCandidateApplication(TestUserRegistry.getByRole(UserRole.CANDIDATE), TestUserRegistry.getByRole(UserRole.RECRUITER));
        CandidateDashboardPage dashboardPage = loginAsCandidate(true);
        dashboardPage.openApplications();
        CandidateApplicationPage applicationPage = new CandidateApplicationPage(driver);
        Assert.assertTrue(applicationPage.isAt(), "Candidate applications page should load.");
        Assert.assertTrue(applicationPage.hasAnyApplication(), "At least one application should be present for status tracking.");
        AssertionUtil.assertNotBlank(applicationPage.getFirstApplicationStatus(), "An application status badge should be visible.");
    }

    @Test(groups = {"regression", "system", "candidate", "access"}, description = "Verify candidate cannot access recruiter/admin functions")
    public void shouldBlockCandidateFromRecruiterAndAdminAreas() {
        loginAsCandidate(false);
        ProtectedRouteHelper protectedRouteHelper = new ProtectedRouteHelper(driver);
        protectedRouteHelper.openProtectedPath("/recruiter/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Candidate should be redirected away from recruiter dashboard.");
        loginAsCandidate(false);
        protectedRouteHelper.openProtectedPath("/admin/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Candidate should be redirected away from admin dashboard.");
    }

    private CandidateDashboardPage loginAsCandidate(boolean ensureOpenJob) {
        UserData candidate = TestUserRegistry.getByRole(UserRole.CANDIDATE);
        BackendBootstrapUtil.ensureUserRegistered(candidate);
        if (ensureOpenJob) {
            BackendBootstrapUtil.ensureOpenJob(TestUserRegistry.getByRole(UserRole.RECRUITER));
        }
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(candidate);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/candidate/dashboard");
        return new CandidateDashboardPage(driver);
    }
}
