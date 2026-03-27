package com.cvortex.ats.pages.candidate;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.pages.common.NavigationComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CandidateDashboardPage extends BasePage {

    private static final By DASHBOARD_SUBTITLE = By.xpath("//p[normalize-space()='Candidate Dashboard']");
    private static final By SUCCESS_MESSAGE = By.xpath("//p[normalize-space()='Success']/following-sibling::p[1]");
    private static final By ERROR_MESSAGE = By.xpath("//p[normalize-space()='Error']/following-sibling::p[1]");

    private final NavigationComponent navigation;
    private final CandidateProfilePage profilePage;

    public CandidateDashboardPage(WebDriver driver) {
        super(driver);
        this.navigation = new NavigationComponent(driver);
        this.profilePage = new CandidateProfilePage(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(DASHBOARD_SUBTITLE);
    }

    public String getWelcomeMessage() {
        return element.getText(By.xpath("//h1[contains(.,'Welcome back')]"));
    }

    public String getSuccessMessage() {
        return element.getText(SUCCESS_MESSAGE);
    }

    public String getErrorMessage() {
        return element.getText(ERROR_MESSAGE);
    }

    public CandidateProfilePage openProfile() {
        navigation.openProfile();
        return profilePage;
    }

    public void openJobs() {
        navigation.clickLink("/candidate/jobs");
    }

    public void openApplications() {
        navigation.clickLink("/candidate/applications");
    }

    public NavigationComponent navigation() {
        return navigation;
    }
}
