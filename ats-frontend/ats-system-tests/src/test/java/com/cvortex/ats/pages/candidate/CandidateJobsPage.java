package com.cvortex.ats.pages.candidate;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.pages.common.NavigationComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class CandidateJobsPage extends BasePage {

    private static final By PAGE_HEADER = By.xpath("//h1[normalize-space()='Browse Jobs']");
    private static final By SEARCH_INPUT = By.cssSelector("input[placeholder*='Search by job title']");
    private static final By JOB_TITLES = By.xpath("//button[normalize-space()='View Details']/ancestor::div[contains(@style,'box-shadow')]//h3");
    private static final By VIEW_DETAILS_BUTTONS = By.xpath("//button[normalize-space()='View Details']");
    private static final By MODAL_HEADER = By.xpath("//button[normalize-space()='Apply Now']");
    private static final By APPLY_NOW_BUTTON = By.xpath("//button[normalize-space()='Apply Now']");
    private static final By ERROR_MESSAGE = By.xpath("//p[normalize-space()='Error']/following-sibling::p[1]");

    private final NavigationComponent navigation;

    public CandidateJobsPage(WebDriver driver) {
        super(driver);
        this.navigation = new NavigationComponent(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_HEADER);
    }

    public int getAvailableJobCount() {
        return wait.waitForAllVisible(VIEW_DETAILS_BUTTONS).size();
    }

    public String getFirstJobTitle() {
        List<WebElement> titles = wait.waitForAllVisible(JOB_TITLES);
        if (titles.isEmpty()) {
            throw new IllegalStateException("No job title is visible on the candidate jobs page");
        }
        return titles.get(0).getText().trim();
    }

    public void search(String query) {
        element.type(SEARCH_INPUT, query);
    }

    public void openJobDetailsByTitle(String title) {
        element.click(By.xpath("//h3[normalize-space()='" + title + "']/ancestor::div[contains(@style,'box-shadow')]//button[normalize-space()='View Details']"));
    }

    public void openFirstJobDetails() {
        List<WebElement> buttons = wait.waitForAllVisible(VIEW_DETAILS_BUTTONS);
        if (buttons.isEmpty()) {
            throw new IllegalStateException("No jobs available to open");
        }
        buttons.get(0).click();
    }

    public boolean isJobDetailsModalOpen() {
        return element.isDisplayed(MODAL_HEADER);
    }

    public void clickApplyNow() {
        element.click(APPLY_NOW_BUTTON);
    }

    public String getErrorMessage() {
        return element.getText(ERROR_MESSAGE);
    }

    public NavigationComponent navigation() {
        return navigation;
    }
}
