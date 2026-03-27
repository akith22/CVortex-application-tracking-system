package com.cvortex.ats.pages.recruiter;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.pages.common.NavigationComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class JobManagementPage extends BasePage {

    private static final By PAGE_HEADER = By.xpath("//h1[normalize-space()='My Job Vacancies']");
    private static final By JOB_TITLES = By.xpath("//main//h3[normalize-space()!='']");

    private final NavigationComponent navigation;

    public JobManagementPage(WebDriver driver) {
        super(driver);
        this.navigation = new NavigationComponent(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_HEADER);
    }

    public String getFirstJobTitle() {
        wait.waitForVisible(PAGE_HEADER);
        List<WebElement> titles = wait.waitForAllVisible(JOB_TITLES);
        if (titles.isEmpty()) {
            throw new IllegalStateException("No recruiter jobs are visible on the management page");
        }
        return titles.get(0).getText().trim();
    }

    public void updateStatus(String jobTitle, String status) {
        WebElement selectElement = wait.waitForVisible(By.xpath("//main//h3[normalize-space()='" + jobTitle + "']/ancestor::div[contains(@style,'box-shadow')][1]//select"));
        new Select(selectElement).selectByVisibleText(status);
    }

    public String getStatus(String jobTitle) {
        WebElement selectElement = wait.waitForVisible(By.xpath("//main//h3[normalize-space()='" + jobTitle + "']/ancestor::div[contains(@style,'box-shadow')][1]//select"));
        return new Select(selectElement).getFirstSelectedOption().getText().trim();
    }

    public boolean hasJob(String jobTitle) {
        return element.isDisplayed(By.xpath("//main//h3[normalize-space()='" + jobTitle + "']"));
    }

    public NavigationComponent navigation() {
        return navigation;
    }
}
