package com.cvortex.ats.utils;

import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ElementUtil {

    private final WebDriver driver;
    private final WaitUtil waitUtil;
    private final JavaScriptUtil javaScriptUtil;

    public ElementUtil(WebDriver driver, WaitUtil waitUtil, JavaScriptUtil javaScriptUtil) {
        this.driver = driver;
        this.waitUtil = waitUtil;
        this.javaScriptUtil = javaScriptUtil;
    }

    public void type(By locator, String value) {
        WebElement element = waitUtil.waitForVisible(locator);
        element.clear();
        element.sendKeys(value);
    }

    public void click(By locator) {
        WebElement element = waitUtil.waitForClickable(locator);
        javaScriptUtil.scrollIntoView(element);
        try {
            element.click();
        } catch (ElementClickInterceptedException exception) {
            javaScriptUtil.click(element);
        }
    }

    public void clickUsingJavaScript(By locator) {
        WebElement element = waitUtil.waitForClickable(locator);
        javaScriptUtil.scrollIntoView(element);
        javaScriptUtil.click(element);
    }

    public String getText(By locator) {
        return waitUtil.waitForVisible(locator).getText().trim();
    }

    public String getValue(By locator) {
        return waitUtil.waitForVisible(locator).getAttribute("value");
    }

    public boolean isDisplayed(By locator) {
        return waitUtil.isVisible(locator);
    }

    public List<WebElement> findAll(By locator) {
        return driver.findElements(locator);
    }

    public void upload(By locator, String absolutePath) {
        waitUtil.waitForPresence(locator).sendKeys(absolutePath);
    }

    public void pressEnter(By locator) {
        waitUtil.waitForVisible(locator).sendKeys(Keys.ENTER);
    }

    public String getValidationMessage(By locator) {
        return javaScriptUtil.getValidationMessage(waitUtil.waitForVisible(locator));
    }
}
