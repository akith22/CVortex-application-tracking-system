package com.cvortex.ats.pages.candidate;

import com.cvortex.ats.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import java.nio.file.Path;

public class ResumeUploadPage extends BasePage {

    private static final By PAGE_HEADER = By.xpath("//h1[normalize-space()='Upload Resume']");
    private static final By FILE_INPUT = By.cssSelector("input[type='file']");
    private static final By UPLOAD_BUTTON = By.xpath("//button[normalize-space()='Upload Resume']");
    private static final By FILE_NAME_TEXT = By.xpath("//p[contains(.,'.pdf') or contains(.,'.doc') or contains(.,'.docx')]");

    public ResumeUploadPage(WebDriver driver) {
        super(driver);
    }

    public boolean isAt() {
        return element.isDisplayed(PAGE_HEADER);
    }

    public void upload(Path filePath) {
        element.upload(FILE_INPUT, filePath.toAbsolutePath().toString());
        element.click(UPLOAD_BUTTON);
    }

    public String getSelectedFileText() {
        return element.getText(FILE_NAME_TEXT);
    }
}
