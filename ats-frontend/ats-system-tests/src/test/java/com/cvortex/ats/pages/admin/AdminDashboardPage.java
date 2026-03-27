package com.cvortex.ats.pages.admin;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.pages.common.NavigationComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AdminDashboardPage extends BasePage {

    private static final By PAGE_SUBTITLE = By.xpath("//p[normalize-space()='Admin Dashboard']");

    private final NavigationComponent navigation;

    public AdminDashboardPage(WebDriver driver) {
        super(driver);
        this.navigation = new NavigationComponent(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_SUBTITLE);
    }

    public void openDashboardTab() {
        navigation.clickMenu("Dashboard");
    }

    public void openUsersTab() {
        navigation.clickMenu("Users");
    }

    public void openJobsTab() {
        navigation.clickMenu("Jobs");
    }

    public String getStatValue(String label) {
        return element.getText(By.xpath("//p[normalize-space()='" + label + "']/following-sibling::p[1]"));
    }

    public boolean isStatisticsCardVisible(String label) {
        return element.isDisplayed(By.xpath("//p[normalize-space()='" + label + "']"));
    }

    public NavigationComponent navigation() {
        return navigation;
    }
}
