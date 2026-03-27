package com.cvortex.ats.pages.recruiter;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.models.JobData;
import com.cvortex.ats.pages.common.NavigationComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RecruiterDashboardPage extends BasePage {

    private static final By PAGE_SUBTITLE = By.xpath("//p[normalize-space()='Recruiter Dashboard']");
    private static final By POST_VACANCY_BUTTON = By.xpath("//button[contains(.,'Post Vacancy')]");
    private static final By SUCCESS_MESSAGE = By.xpath("//p[normalize-space()='Success']/following-sibling::p[1]");
    private static final By ERROR_MESSAGE = By.xpath("//p[normalize-space()='Error']/following-sibling::p[1]");

    private final NavigationComponent navigation;
    private final RecruiterProfilePage profilePage;
    private final CreateEditJobPage createEditJobPage;

    public RecruiterDashboardPage(WebDriver driver) {
        super(driver);
        this.navigation = new NavigationComponent(driver);
        this.profilePage = new RecruiterProfilePage(driver);
        this.createEditJobPage = new CreateEditJobPage(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_SUBTITLE);
    }

    public RecruiterProfilePage openProfile() {
        navigation.openProfile();
        return profilePage;
    }

    public CreateEditJobPage openCreateJobModal() {
        element.click(POST_VACANCY_BUTTON);
        return createEditJobPage;
    }

    public void createJob(JobData jobData) {
        openCreateJobModal().createJob(jobData);
    }

    public String getSuccessMessage() {
        return element.getText(SUCCESS_MESSAGE);
    }

    public String getErrorMessage() {
        return element.getText(ERROR_MESSAGE);
    }

    public NavigationComponent navigation() {
        return navigation;
    }
}
