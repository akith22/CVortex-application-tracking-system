package com.cvortex.ats.pages.admin;

import org.openqa.selenium.WebDriver;

public class AdminStatisticsPage extends AdminDashboardPage {

    public AdminStatisticsPage(WebDriver driver) {
        super(driver);
    }

    public String getTotalUsers() {
        openDashboardTab();
        return getStatValue("Total Users");
    }

    public String getRecruiterCount() {
        openDashboardTab();
        return getStatValue("Recruiters");
    }

    public String getCandidateCount() {
        openDashboardTab();
        return getStatValue("Candidates");
    }

    public String getTotalJobs() {
        openDashboardTab();
        return getStatValue("Total Jobs");
    }
}
