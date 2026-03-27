package com.cvortex.ats.pages.admin;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AdminJobsPage extends AdminDashboardPage {

    public AdminJobsPage(WebDriver driver) {
        super(driver);
    }

    public boolean hasJob(String title) {
        openJobsTab();
        return element.isDisplayed(By.xpath("//table//span[normalize-space()='" + title + "']"));
    }

    public int getJobCount() {
        openJobsTab();
        return element.findAll(By.xpath("//table/tbody/tr")).size();
    }
}
