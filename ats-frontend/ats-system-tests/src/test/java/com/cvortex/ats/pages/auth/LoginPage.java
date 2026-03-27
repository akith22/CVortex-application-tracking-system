package com.cvortex.ats.pages.auth;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.config.ConfigReader;
import com.cvortex.ats.models.UserData;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private static final By EMAIL_INPUT = By.id("email");
    private static final By PASSWORD_INPUT = By.id("password");
    private static final By SIGN_IN_BUTTON = By.cssSelector("button[type='submit']");
    private static final By CREATE_ACCOUNT_LINK = By.cssSelector("a[href='/register']");
    private static final By PAGE_HEADER = By.xpath("//h2[normalize-space()='Welcome Back']");
    private static final By GENERAL_ERROR = By.cssSelector(".error-message");
    private static final By SUCCESS_HEADER = By.xpath("//h3[normalize-space()='Login Successful!']");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public LoginPage open() {
        driver.get(ConfigReader.get("frontend.base.url") + "/login");
        wait.waitForVisible(PAGE_HEADER);
        return this;
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_HEADER);
    }

    public LoginPage enterEmail(String email) {
        element.type(EMAIL_INPUT, email);
        return this;
    }

    public LoginPage enterPassword(String password) {
        element.type(PASSWORD_INPUT, password);
        return this;
    }

    public void clickSignIn() {
        element.click(SIGN_IN_BUTTON);
    }

    public void login(UserData userData) {
        enterEmail(userData.getEmail());
        enterPassword(userData.getPassword());
        clickSignIn();
    }

    public String getGeneralErrorMessage() {
        return element.getText(GENERAL_ERROR);
    }

    public String getEmailValidationMessage() {
        return element.getValidationMessage(EMAIL_INPUT);
    }

    public String getPasswordValidationMessage() {
        return element.getValidationMessage(PASSWORD_INPUT);
    }

    public boolean isSuccessToastDisplayed() {
        return element.isDisplayed(SUCCESS_HEADER);
    }

    public void openRegistrationPage() {
        element.click(CREATE_ACCOUNT_LINK);
    }
}
