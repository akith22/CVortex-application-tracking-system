package com.cvortex.ats.pages.common;

import com.cvortex.ats.base.BasePage;
import com.cvortex.ats.config.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProtectedRouteHelper extends BasePage {

    private static final By LOGIN_HEADER = By.xpath("//h2[normalize-space()='Welcome Back']");

    public ProtectedRouteHelper(WebDriver driver) {
        super(driver);
    }

    public void openProtectedPath(String path) {
        driver.get(ConfigReader.get("frontend.base.url") + path);
    }

    public boolean isRedirectedToLogin() {
        wait.waitForUrlContains("/login");
        return element.isDisplayed(LOGIN_HEADER);
    }
}
