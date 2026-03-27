package com.cvortex.ats.pages.candidate;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.pages.common.NavigationComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.nio.file.Path;
import java.util.List;

public class CandidateApplicationPage extends BasePage {

    private static final By PAGE_HEADER = By.xpath("//h1[normalize-space()='My Applications']");
    private static final By APPLY_MODAL_HEADER = By.xpath("//h2[normalize-space()='Apply for Job']");
    private static final By FILE_INPUT = By.id("resume-upload");
    private static final By SUBMIT_BUTTON = By.xpath("//button[normalize-space()='Submit Application']");
    private static final By ERROR_MESSAGE = By.xpath("//p[normalize-space()='Error']/following-sibling::p[1]");
    private static final By SUCCESS_MESSAGE = By.xpath("//p[normalize-space()='Success']/following-sibling::p[1]");
    private static final By APPLICATION_TITLES = By.xpath("//main//h3[normalize-space()!='']");
    private static final By STATUS_BADGES = By.xpath("//main//span[contains(.,'APPLIED') or contains(.,'SHORTLISTED') or contains(.,'REJECTED') or contains(.,'HIRED')]");

    private final NavigationComponent navigation;

    public CandidateApplicationPage(WebDriver driver) {
        super(driver);
        this.navigation = new NavigationComponent(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_HEADER);
    }

    public boolean isApplyModalOpen() {
        return element.isDisplayed(APPLY_MODAL_HEADER);
    }

    public void uploadResume(Path filePath) {
        element.upload(FILE_INPUT, filePath.toAbsolutePath().toString());
    }

    public void submitApplication() {
        element.clickUsingJavaScript(SUBMIT_BUTTON);
    }

    public void submitApplication(Path filePath) {
        uploadResume(filePath);
        submitApplication();
    }

    public boolean isSubmitButtonDisabled() {
        WebElement button = wait.waitForPresence(SUBMIT_BUTTON);
        return button.getAttribute("disabled") != null;
    }

    public String getErrorMessage() {
        return element.getText(ERROR_MESSAGE);
    }

    public String getSuccessMessage() {
        return element.getText(SUCCESS_MESSAGE);
    }

    public boolean hasApplicationForJob(String title) {
        return element.isDisplayed(By.xpath("//main//h3[contains(normalize-space(),'" + title + "')]"));
    }

    public boolean hasAnyApplication() {
        return !element.findAll(APPLICATION_TITLES).isEmpty();
    }

    public String getFirstApplicationStatus() {
        List<WebElement> badges = wait.waitForAllVisible(STATUS_BADGES);
        return badges.get(0).getText().trim();
    }

    public String getApplicationStatusForJob(String title) {
        return element.getText(By.xpath("//main//div[.//h3[contains(normalize-space(),'" + title + "')]]//span[contains(.,'APPLIED') or contains(.,'SHORTLISTED') or contains(.,'REJECTED') or contains(.,'HIRED')][1]"));
    }

    public NavigationComponent navigation() {
        return navigation;
    }
}
