package com.cvortex.ats.pages.recruiter;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.models.JobData;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CreateEditJobPage extends BasePage {

    private static final By MODAL_HEADER = By.xpath("//h3[normalize-space()='Post a Vacancy']");
    private static final By TITLE_INPUT = By.cssSelector("input[placeholder='Job Title *']");
    private static final By LOCATION_INPUT = By.cssSelector("input[placeholder='Location *']");
    private static final By TYPE_INPUT = By.cssSelector("input[placeholder*='Job Type']");
    private static final By DESCRIPTION_TEXTAREA = By.cssSelector("textarea[placeholder='Job Description']");
    private static final By POST_JOB_BUTTON = By.xpath("//button[normalize-space()='Post Job']");
    private static final By CANCEL_BUTTON = By.xpath("//button[normalize-space()='Cancel']");

    // Replace these inferred locators after the UI exposes a dedicated recruiter edit form.
    private static final By EDIT_TITLE_INPUT_PLACEHOLDER = By.id("replace-edit-job-title");
    private static final By EDIT_DESCRIPTION_TEXTAREA_PLACEHOLDER = By.id("replace-edit-job-description");
    private static final By UPDATE_JOB_BUTTON_PLACEHOLDER = By.id("replace-update-job-button");

    public CreateEditJobPage(WebDriver driver) {
        super(driver);
    }

    public boolean isOpen() {
        return element.isDisplayed(MODAL_HEADER);
    }

    public void createJob(JobData jobData) {
        element.type(TITLE_INPUT, jobData.getTitle());
        element.type(LOCATION_INPUT, jobData.getLocation());
        element.type(TYPE_INPUT, jobData.getType());
        element.type(DESCRIPTION_TEXTAREA, jobData.getDescription());
        element.click(POST_JOB_BUTTON);
    }

    public void createJobWithoutRequiredFields() {
        element.click(POST_JOB_BUTTON);
    }

    public void cancel() {
        element.click(CANCEL_BUTTON);
    }

    public void updateJobDetails(String title, String description) {
        element.type(EDIT_TITLE_INPUT_PLACEHOLDER, title);
        element.type(EDIT_DESCRIPTION_TEXTAREA_PLACEHOLDER, description);
        element.click(UPDATE_JOB_BUTTON_PLACEHOLDER);
    }
}
