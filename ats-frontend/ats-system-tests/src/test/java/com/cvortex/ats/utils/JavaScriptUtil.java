package com.cvortex.ats.utils;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class JavaScriptUtil {

    private final JavascriptExecutor javascriptExecutor;

    public JavaScriptUtil(WebDriver driver) {
        this.javascriptExecutor = (JavascriptExecutor) driver;
    }

    public void scrollIntoView(WebElement element) {
        javascriptExecutor.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
    }

    public void click(WebElement element) {
        javascriptExecutor.executeScript("arguments[0].click();", element);
    }

    public String getValidationMessage(WebElement element) {
        return String.valueOf(javascriptExecutor.executeScript("return arguments[0].validationMessage;", element));
    }

    public void setLocalStorageItem(String key, String value) {
        javascriptExecutor.executeScript("window.localStorage.setItem(arguments[0], arguments[1]);", key, value);
    }

    public void removeLocalStorageItem(String key) {
        javascriptExecutor.executeScript("window.localStorage.removeItem(arguments[0]);", key);
    }
}
