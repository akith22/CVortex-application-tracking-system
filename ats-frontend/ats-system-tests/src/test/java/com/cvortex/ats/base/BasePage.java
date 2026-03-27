package com.cvortex.ats.base;

import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.utils.ElementUtil;
import com.cvortex.ats.utils.JavaScriptUtil;
import com.cvortex.ats.utils.WaitUtil;
import org.openqa.selenium.WebDriver;

public abstract class BasePage {

    protected final WebDriver driver;
    protected final WaitUtil wait;
    protected final ElementUtil element;
    protected final JavaScriptUtil javascript;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitUtil(driver, FrameworkConstants.DEFAULT_TIMEOUT);
        this.javascript = new JavaScriptUtil(driver);
        this.element = new ElementUtil(driver, wait, javascript);
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public String getTitle() {
        return driver.getTitle();
    }
}
