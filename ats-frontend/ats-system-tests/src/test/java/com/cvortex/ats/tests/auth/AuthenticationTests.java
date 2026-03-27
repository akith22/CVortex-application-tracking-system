package com.cvortex.ats.tests.auth;

import com.cvortex.ats.base.BaseTest;
import com.cvortex.ats.config.ConfigReader;
import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.dataproviders.TestDataProviders;
import com.cvortex.ats.enums.UserRole;
import com.cvortex.ats.models.UserData;
import com.cvortex.ats.pages.auth.LoginPage;
import com.cvortex.ats.pages.auth.RegistrationPage;
import com.cvortex.ats.pages.candidate.CandidateDashboardPage;
import com.cvortex.ats.pages.common.ProtectedRouteHelper;
import com.cvortex.ats.utils.AssertionUtil;
import com.cvortex.ats.utils.BackendBootstrapUtil;
import com.cvortex.ats.utils.TestDataFactory;
import com.cvortex.ats.utils.TestUserRegistry;
import com.cvortex.ats.utils.TokenUtil;
import com.cvortex.ats.utils.WaitUtil;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AuthenticationTests extends BaseTest {

    @Test(groups = {"smoke", "regression", "system", "auth"}, description = "Register with valid candidate data")
    public void shouldRegisterWithValidCandidateData() {
        UserData candidate = TestDataFactory.buildUniqueCandidate();
        RegistrationPage registrationPage = new RegistrationPage(driver).open();

        registrationPage.register(candidate);

        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/login");
        Assert.assertTrue(driver.getCurrentUrl().contains("/login"), "Registration should redirect back to login.");
    }

    @Test(groups = {"regression", "system", "auth"}, description = "Register with missing required fields")
    public void shouldShowValidationForMissingRequiredRegistrationFields() {
        RegistrationPage registrationPage = new RegistrationPage(driver).open();
        registrationPage.clickCreateAccount();
        AssertionUtil.assertNotBlank(registrationPage.getNameValidationMessage(), "Name field should expose native required validation.");
    }

    @Test(groups = {"regression", "system", "auth"}, description = "Register with invalid email format")
    public void shouldRejectInvalidRegistrationEmailFormat() {
        RegistrationPage registrationPage = new RegistrationPage(driver).open();
        registrationPage.enterName("Invalid Email User");
        registrationPage.enterEmail("invalid-email");
        registrationPage.enterPassword("Qa@12345");
        registrationPage.clickCreateAccount();
        AssertionUtil.assertNotBlank(registrationPage.getEmailValidationMessage(), "Invalid email should trigger native browser validation.");
    }

    @Test(groups = {"regression", "system", "auth"}, description = "Register with duplicate email")
    public void shouldShowErrorForDuplicateRegistrationEmail() {
        UserData existingCandidate = TestUserRegistry.getByRole(UserRole.CANDIDATE);
        BackendBootstrapUtil.ensureUserRegistered(existingCandidate);
        RegistrationPage registrationPage = new RegistrationPage(driver).open();

        registrationPage.register(existingCandidate);

        AssertionUtil.assertContains(registrationPage.getGeneralErrorMessage(), "exists", "Duplicate registration should display duplicate-email feedback.");
    }

    @Test(dataProvider = "roleCredentials", dataProviderClass = TestDataProviders.class, groups = {"smoke", "regression", "system", "auth"}, description = "Login with valid credentials for each role")
    public void shouldLoginWithValidCredentialsForEachRole(UserData userData) {
        BackendBootstrapUtil.ensureUserRegistered(userData);
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(userData);

        String expectedPath = switch (UserRole.valueOf(userData.getRole())) {
            case ADMIN -> "/admin/dashboard";
            case RECRUITER -> "/recruiter/dashboard";
            case CANDIDATE -> "/candidate/dashboard";
        };
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains(expectedPath);
        Assert.assertTrue(driver.getCurrentUrl().contains(expectedPath), "User should land on the expected dashboard.");
    }

    @Test(groups = {"regression", "system", "auth"}, description = "Login with invalid password")
    public void shouldRejectInvalidPassword() {
        UserData candidate = TestUserRegistry.getByRole(UserRole.CANDIDATE);
        BackendBootstrapUtil.ensureUserRegistered(candidate);
        LoginPage loginPage = new LoginPage(driver).open();

        loginPage.enterEmail(candidate.getEmail()).enterPassword("WrongPassword@123");
        loginPage.clickSignIn();

        AssertionUtil.assertContains(loginPage.getGeneralErrorMessage(), "Invalid", "Invalid password should show an authentication error.");
    }

    @Test(groups = {"regression", "system", "auth"}, description = "Login with unregistered email")
    public void shouldRejectUnregisteredEmail() {
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.enterEmail("missing." + System.currentTimeMillis() + "@cvortex.test").enterPassword("Qa@12345");
        loginPage.clickSignIn();
        AssertionUtil.assertNotBlank(loginPage.getGeneralErrorMessage(), "Unregistered email should show an authentication error.");
    }

    @Test(groups = {"smoke", "regression", "system", "auth", "access"}, description = "Logout flow")
    public void shouldLogoutSuccessfully() {
        UserData candidate = TestUserRegistry.getByRole(UserRole.CANDIDATE);
        BackendBootstrapUtil.ensureUserRegistered(candidate);
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(candidate);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/candidate/dashboard");

        new CandidateDashboardPage(driver).navigation().logout();
        Assert.assertTrue(new LoginPage(driver).isAt(), "User should be redirected to login after logout.");
    }

    @Test(groups = {"smoke", "regression", "system", "access"}, description = "Verify protected pages cannot be accessed without login")
    public void shouldRedirectAnonymousUsersFromProtectedPages() {
        ProtectedRouteHelper protectedRouteHelper = new ProtectedRouteHelper(driver);
        protectedRouteHelper.openProtectedPath("/candidate/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Anonymous user should be redirected from candidate dashboard.");
        protectedRouteHelper.openProtectedPath("/recruiter/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Anonymous user should be redirected from recruiter dashboard.");
        protectedRouteHelper.openProtectedPath("/admin/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Anonymous user should be redirected from admin dashboard.");
    }

    @Test(groups = {"regression", "system", "access"}, description = "Verify role-based page restrictions and invalid token behavior")
    public void shouldEnforceRoleBasedRestrictionsAndInvalidTokenHandling() {
        UserData candidate = TestUserRegistry.getByRole(UserRole.CANDIDATE);
        BackendBootstrapUtil.ensureUserRegistered(candidate);
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(candidate);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/candidate/dashboard");

        ProtectedRouteHelper protectedRouteHelper = new ProtectedRouteHelper(driver);
        protectedRouteHelper.openProtectedPath("/recruiter/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Candidate should not access recruiter dashboard.");

        loginPage.open();
        TokenUtil.injectToken(driver, ConfigReader.get("invalid.jwt.token"));
        protectedRouteHelper.openProtectedPath("/admin/dashboard");
        Assert.assertTrue(protectedRouteHelper.isRedirectedToLogin(), "Invalid JWT should redirect the user to login.");
    }
}
