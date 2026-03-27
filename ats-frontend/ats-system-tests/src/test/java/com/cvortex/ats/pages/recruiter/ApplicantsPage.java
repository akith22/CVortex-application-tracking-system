package com.cvortex.ats.pages.recruiter;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.pages.common.NavigationComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class ApplicantsPage extends BasePage {

    private static final By PAGE_HEADER = By.xpath("//h1[normalize-space()='Applications Management']");
    private static final By JOB_TITLES_WITH_APPLICANTS = By.xpath("//main//div[.//button[normalize-space()='View Details']]//h2[normalize-space()!='']");
    private static final By APPLICANT_EMAILS = By.xpath("//main//div[.//button[normalize-space()='View Details']]//p[contains(.,'@')]");
    private static final By APPLICANT_MODAL_HEADER = By.xpath("//h3[normalize-space()='Applicant Details']");
    private static final By RESUME_BUTTON = By.xpath("//button[contains(.,'View Resume')]");
    private static final By STATUS_SELECT_IN_MODAL = By.xpath("//label[normalize-space()='Update Status:']/following-sibling::select");

    private final NavigationComponent navigation;

    public ApplicantsPage(WebDriver driver) {
        super(driver);
        this.navigation = new NavigationComponent(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_HEADER);
    }

    public String getFirstJobTitle() {
        wait.waitForVisible(PAGE_HEADER);
        List<WebElement> titles = wait.waitForAllVisible(JOB_TITLES_WITH_APPLICANTS);
        if (titles.isEmpty()) {
            throw new IllegalStateException("No recruiter job sections with applicants are visible on the applicants page");
        }
        return titles.get(0).getText().trim();
    }

    public String getFirstApplicantEmail() {
        List<WebElement> emails = wait.waitForAllVisible(APPLICANT_EMAILS);
        if (emails.isEmpty()) {
            throw new IllegalStateException("No applicants are visible on the applicants page");
        }
        return emails.get(0).getText().trim();
    }

    public boolean hasApplicantsForJob(String jobTitle) {
        return element.isDisplayed(By.xpath("//main//div[.//h2[normalize-space()='" + jobTitle + "'] and .//button[normalize-space()='View Details']]") );
    }

    public void openApplicantDetails(String jobTitle, String applicantEmail) {
        element.click(By.xpath("//main//div[.//h2[normalize-space()='" + jobTitle + "']]//p[normalize-space()='" + applicantEmail + "']/ancestor::div[contains(@style,'cursor: pointer')][1]//button[normalize-space()='View Details']"));
    }

    public void openFirstApplicantDetails(String jobTitle) {
        element.click(By.xpath("//main//div[.//h2[normalize-space()='" + jobTitle + "']]//button[normalize-space()='View Details'][1]"));
    }

    public boolean isApplicantModalOpen() {
        return element.isDisplayed(APPLICANT_MODAL_HEADER);
    }

    public void updateApplicationStatusFromCard(String jobTitle, String applicantEmail, String status) {
        By selectLocator = By.xpath("//main//div[.//h2[normalize-space()='" + jobTitle + "']]//p[normalize-space()='" + applicantEmail + "']/ancestor::div[contains(@style,'cursor: pointer')][1]//select");
        WebElement selectElement = wait.waitForVisible(selectLocator);
        new Select(selectElement).selectByVisibleText(status);
        waitForSelectedStatus(selectLocator, status);
    }

    public void updateApplicationStatusFromModal(String status) {
        new Select(wait.waitForVisible(STATUS_SELECT_IN_MODAL)).selectByVisibleText(status);
        waitForSelectedStatus(STATUS_SELECT_IN_MODAL, status);
    }

    public String getApplicantStatusFromCard(String jobTitle, String applicantEmail) {
        WebElement selectElement = wait.waitForVisible(By.xpath("//main//div[.//h2[normalize-space()='" + jobTitle + "']]//p[normalize-space()='" + applicantEmail + "']/ancestor::div[contains(@style,'cursor: pointer')][1]//select"));
        return new Select(selectElement).getFirstSelectedOption().getText().trim();
    }

    public boolean isResumeAvailableInModal() {
        return element.isDisplayed(RESUME_BUTTON);
    }

    public void openResumeFromModal() {
        element.click(RESUME_BUTTON);
    }

    public NavigationComponent navigation() {
        return navigation;
    }

    private void waitForSelectedStatus(By selectLocator, String status) {
        new WebDriverWait(driver, Duration.ofSeconds(10)).until(webDriver -> {
            WebElement currentSelect = webDriver.findElement(selectLocator);
            return status.equalsIgnoreCase(new Select(currentSelect).getFirstSelectedOption().getText().trim());
        });
    }
}
