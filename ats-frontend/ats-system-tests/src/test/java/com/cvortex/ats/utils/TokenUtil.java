package com.cvortex.ats.utils;

import org.openqa.selenium.WebDriver;

public final class TokenUtil {

    private TokenUtil() {
    }

    public static void injectToken(WebDriver driver, String token) {
        new JavaScriptUtil(driver).setLocalStorageItem("token", token);
    }

    public static void clearToken(WebDriver driver) {
        new JavaScriptUtil(driver).removeLocalStorageItem("token");
    }
}
