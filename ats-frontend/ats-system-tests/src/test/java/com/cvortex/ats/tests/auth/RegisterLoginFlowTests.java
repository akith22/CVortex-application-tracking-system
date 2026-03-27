package com.cvortex.ats.tests.auth;

import com.cvortex.ats.base.BaseTest;
import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.models.UserData;
import com.cvortex.ats.pages.auth.LoginPage;
import com.cvortex.ats.pages.auth.RegistrationPage;
import com.cvortex.ats.utils.TestDataFactory;
import com.cvortex.ats.utils.WaitUtil;
import org.testng.Assert;
import org.testng.annotations.Test;

public class RegisterLoginFlowTests extends BaseTest {

    @Test(groups = {"smoke", "regression", "system", "auth", "e2e"}, description = "Register first and then login with the same new candidate account")
    public void shouldRegisterThenLoginWithSameCandidate() {
        UserData candidate = TestDataFactory.buildUniqueCandidate();

        RegistrationPage registrationPage = new RegistrationPage(driver).open();
        registrationPage.register(candidate);
        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/login");
        Assert.assertTrue(driver.getCurrentUrl().contains("/login"),
                "Registration should complete and redirect the user to login before the login step starts.");

        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.login(candidate);

        new WaitUtil(driver, FrameworkConstants.LARGE_TIMEOUT).waitForUrlContains("/candidate/dashboard");
        Assert.assertTrue(driver.getCurrentUrl().contains("/candidate/dashboard"),
                "Newly registered candidate should be able to log in immediately.");
    }
}
