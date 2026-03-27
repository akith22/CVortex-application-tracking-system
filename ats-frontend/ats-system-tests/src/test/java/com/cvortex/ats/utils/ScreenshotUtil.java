package com.cvortex.ats.utils;

import com.cvortex.ats.constants.FrameworkConstants;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class ScreenshotUtil {

    private ScreenshotUtil() {
    }

    public static String capture(WebDriver driver, String testName) {
        try {
            Files.createDirectories(FrameworkConstants.SCREENSHOT_DIR);
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss_SSS"));
            String safeFileName = testName.replaceAll("[^a-zA-Z0-9-_]", "_") + "_" + timestamp + ".png";
            Path destination = FrameworkConstants.SCREENSHOT_DIR.resolve(safeFileName);
            File source = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            FileUtils.copyFile(source, destination.toFile());
            return destination.toString();
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to save screenshot", exception);
        }
    }
}
