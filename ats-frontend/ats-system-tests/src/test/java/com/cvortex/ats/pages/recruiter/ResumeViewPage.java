package com.cvortex.ats.pages.recruiter;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public class ResumeViewPage {

    private final WebDriver driver;

    public ResumeViewPage(WebDriver driver) {
        this.driver = driver;
    }

    public void switchToLatestTab() {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.numberOfWindowsToBe(2));
        } catch (Exception ignored) {
            // Some browsers keep the blob/pdf in the same tab; fall back to current handle.
        }
        List<String> windows = new ArrayList<>(driver.getWindowHandles());
        driver.switchTo().window(windows.get(windows.size() - 1));
    }

    public boolean isResumeTabOpen() {
        String currentUrl = driver.getCurrentUrl();
        return currentUrl.startsWith("blob:")
                || currentUrl.contains("pdf")
                || currentUrl.contains("resume")
                || driver.getWindowHandles().size() > 1;
    }
}
