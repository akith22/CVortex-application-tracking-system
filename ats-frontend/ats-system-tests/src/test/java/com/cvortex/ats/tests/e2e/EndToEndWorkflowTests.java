package com.cvortex.ats.tests.e2e;

import com.cvortex.ats.base.BaseTest;
import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.models.JobData;
import com.cvortex.ats.models.UserData;
import com.cvortex.ats.pages.admin.AdminJobsPage;
import com.cvortex.ats.pages.admin.AdminUsersPage;
import com.cvortex.ats.pages.auth.LoginPage;
import com.cvortex.ats.pages.auth.RegistrationPage;
import com.cvortex.ats.pages.candidate.CandidateApplicationPage;
import com.cvortex.ats.pages.candidate.CandidateDashboardPage;
import com.cvortex.ats.pages.candidate.CandidateJobsPage;
import com.cvortex.ats.pages.recruiter.ApplicantsPage;
import com.cvortex.ats.pages.recruiter.RecruiterDashboardPage;
import com.cvortex.ats.utils.AssertionUtil;
import com.cvortex.ats.utils.BackendBootstrapUtil;
import com.cvortex.ats.utils.TestDataFactory;
import com.cvortex.ats.utils.TestUserRegistry;
import com.cvortex.ats.utils.WaitUtil;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.nio.file.Path;

public class EndToEndWorkflowTests extends BaseTest {

    @Test(groups = {"smoke", "regression", "system", "e2e"}, description = "Candidate registers, recruiter creates job, candidate applies, recruiter updates status, admin validates visibility")
    public void shouldExecuteCrossRoleApplicationLifecycle() {
        UserData candidate = TestDataFactory.buildUniqueCandidate();
        JobData jobData = TestDataFactory.buildUniqueJob();
        UserData recruiter = TestUserRegistry.getByRole(com.cvortex.ats.enums.UserRole.RECRUITER);
        UserData admin = TestUserRegistry.getByRole(com.cvortex.ats.enums.UserRole.ADMIN);
        BackendBootstrapUtil.ensureUserRegistered(recruiter);
        BackendBootstrapUtil.ensureUserRegistered(admin);

        RegistrationPage registrationPage = new RegistrationPage(driver).open();
        registrationPage.register(candidate);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/login");

        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(recruiter);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/recruiter/dashboard");
        RecruiterDashboardPage recruiterDashboardPage = new RecruiterDashboardPage(driver);
        recruiterDashboardPage.createJob(jobData);
        AssertionUtil.assertContains(recruiterDashboardPage.getSuccessMessage(), "Job posted successfully", "Recruiter should create a job for the E2E flow.");
        recruiterDashboardPage.navigation().logout();

        loginPage = new LoginPage(driver).open();
        loginPage.login(candidate);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/candidate/dashboard");
        CandidateDashboardPage candidateDashboardPage = new CandidateDashboardPage(driver);
        candidateDashboardPage.openJobs();
        CandidateJobsPage candidateJobsPage = new CandidateJobsPage(driver);
        candidateJobsPage.search(jobData.getTitle());
        candidateJobsPage.openJobDetailsByTitle(jobData.getTitle());
        candidateJobsPage.clickApplyNow();

        CandidateApplicationPage candidateApplicationPage = new CandidateApplicationPage(driver);
        candidateApplicationPage.submitApplication(Path.of(FrameworkConstants.TEST_FILES_DIR.toString(), "sample-resume.pdf"));
        AssertionUtil.assertContains(candidateApplicationPage.getSuccessMessage(), "Successfully applied", "Candidate should apply to the recruiter-created job.");
        candidateApplicationPage.navigation().logout();

        loginPage = new LoginPage(driver).open();
        loginPage.login(recruiter);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/recruiter/dashboard");
        recruiterDashboardPage = new RecruiterDashboardPage(driver);
        recruiterDashboardPage.navigation().clickLink("/recruiter/applications");
        ApplicantsPage applicantsPage = new ApplicantsPage(driver);
        applicantsPage.openApplicantDetails(jobData.getTitle(), candidate.getEmail());
        Assert.assertTrue(applicantsPage.isApplicantModalOpen(), "Recruiter should be able to open the new applicant details.");
        applicantsPage.updateApplicationStatusFromModal("SHORTLISTED");
        AssertionUtil.assertContains(applicantsPage.getApplicantStatusFromCard(jobData.getTitle(), candidate.getEmail()), "SHORTLISTED", "Recruiter should update the candidate application status.");
        applicantsPage.navigation().logout();

        loginPage = new LoginPage(driver).open();
        loginPage.login(candidate);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/candidate/dashboard");
        candidateDashboardPage = new CandidateDashboardPage(driver);
        candidateDashboardPage.openApplications();
        candidateApplicationPage = new CandidateApplicationPage(driver);
        AssertionUtil.assertContains(candidateApplicationPage.getApplicationStatusForJob(jobData.getTitle()), "SHORTLISTED", "Candidate should see the updated application status.");
        candidateApplicationPage.navigation().logout();

        BackendBootstrapUtil.ensureAdminViewData(admin, recruiter, candidate);
        loginPage = new LoginPage(driver).open();
        loginPage.login(admin);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/admin/dashboard");
        AdminUsersPage adminUsersPage = new AdminUsersPage(driver);
        AdminJobsPage adminJobsPage = new AdminJobsPage(driver);
        Assert.assertTrue(adminUsersPage.hasUser(candidate.getEmail()), "Admin users view should list the newly registered candidate.");
        Assert.assertTrue(adminJobsPage.hasJob(jobData.getTitle()), "Admin jobs view should list the recruiter-created job.");
    }
}
