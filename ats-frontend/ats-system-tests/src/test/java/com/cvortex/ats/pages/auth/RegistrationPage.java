package com.cvortex.ats.pages.auth;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.config.ConfigReader;
import com.cvortex.ats.models.UserData;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegistrationPage extends BasePage {

    private static final By NAME_INPUT = By.id("name");
    private static final By EMAIL_INPUT = By.id("email");
    private static final By PASSWORD_INPUT = By.id("password");
    private static final By ROLE_SELECT = By.id("role");
    private static final By SUBMIT_BUTTON = By.cssSelector("button[type='submit']");
    private static final By PAGE_HEADER = By.xpath("//h2[normalize-space()='Create Account']");
    private static final By GENERAL_ERROR = By.cssSelector(".error-message");
    private static final By SUCCESS_HEADER = By.xpath("//h3[normalize-space()='Registration Successful!']");

    public RegistrationPage(WebDriver driver) {
        super(driver);
    }

    public RegistrationPage open() {
        driver.get(ConfigReader.get("frontend.base.url") + "/register");
        wait.waitForVisible(PAGE_HEADER);
        return this;
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_HEADER);
    }

    public RegistrationPage enterName(String name) {
        element.type(NAME_INPUT, name);
        return this;
    }

    public RegistrationPage enterEmail(String email) {
        element.type(EMAIL_INPUT, email);
        return this;
    }

    public RegistrationPage enterPassword(String password) {
        element.type(PASSWORD_INPUT, password);
        return this;
    }

    public RegistrationPage selectRole(String role) {
        element.click(ROLE_SELECT);
        element.click(By.xpath("//select[@id='role']/option[@value='" + role + "']"));
        return this;
    }

    public void clickCreateAccount() {
        element.click(SUBMIT_BUTTON);
    }

    public void register(UserData userData) {
        enterName(userData.getName());
        enterEmail(userData.getEmail());
        enterPassword(userData.getPassword());
        selectRole(userData.getRole());
        clickCreateAccount();
    }

    public String getGeneralErrorMessage() {
        return element.getText(GENERAL_ERROR);
    }

    public boolean isSuccessToastDisplayed() {
        return element.isDisplayed(SUCCESS_HEADER);
    }

    public String getNameValidationMessage() {
        return element.getValidationMessage(NAME_INPUT);
    }

    public String getEmailValidationMessage() {
        return element.getValidationMessage(EMAIL_INPUT);
    }

    public String getPasswordValidationMessage() {
        return element.getValidationMessage(PASSWORD_INPUT);
    }
}
