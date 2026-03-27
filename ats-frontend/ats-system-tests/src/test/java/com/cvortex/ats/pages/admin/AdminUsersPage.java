package com.cvortex.ats.pages.admin;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AdminUsersPage extends AdminDashboardPage {

    public AdminUsersPage(WebDriver driver) {
        super(driver);
    }

    public boolean hasUser(String email) {
        openUsersTab();
        return element.isDisplayed(By.xpath("//table//td[normalize-space()='" + email + "']"));
    }

    public int getUserCount() {
        openUsersTab();
        return element.findAll(By.xpath("//table/tbody/tr")).size();
    }
}
