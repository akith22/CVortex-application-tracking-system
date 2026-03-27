package com.cvortex.ats.pages.recruiter;

import com.cvortex.ats.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RecruiterProfilePage extends BasePage {

    private static final By MODAL_HEADER = By.xpath("//h3[normalize-space()='My Profile']");
    private static final By NAME_INPUT = By.xpath("//h3[normalize-space()='My Profile']/following::input[1]");
    private static final By EMAIL_INPUT = By.xpath("//h3[normalize-space()='My Profile']/following::input[2]");
    private static final By SAVE_BUTTON = By.xpath("//h3[normalize-space()='My Profile']/following::button[normalize-space()='Save'][1]");

    public RecruiterProfilePage(WebDriver driver) {
        super(driver);
    }

    public boolean isOpen() {
        return element.isDisplayed(MODAL_HEADER);
    }

    public void updateName(String name) {
        element.type(NAME_INPUT, name);
        element.click(SAVE_BUTTON);
    }

    public String getEmail() {
        return element.getValue(EMAIL_INPUT);
    }
}
