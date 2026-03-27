package com.cvortex.ats.pages.common;

import com.cvortex.ats.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class NavigationComponent extends BasePage {

    private static final By LOGOUT_BUTTON = By.xpath("//button[normalize-space()='Logout']");
    private static final By PROFILE_BUTTON = By.xpath("//button[normalize-space()='Logout']/preceding::button[1]");

    public NavigationComponent(WebDriver driver) {
        super(driver);
    }

    public void clickMenu(String label) {
        element.click(By.xpath("//aside//button[normalize-space()='" + label + "']"));
    }

    public void clickLink(String href) {
        element.click(By.cssSelector("a[href='" + href + "'] button"));
    }

    public void openProfile() {
        element.click(PROFILE_BUTTON);
    }

    public void logout() {
        element.click(LOGOUT_BUTTON);
    }

    public boolean hasMenuItem(String label) {
        return element.isDisplayed(By.xpath("//aside//button[normalize-space()='" + label + "']"));
    }
}
