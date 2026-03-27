package com.cvortex.ats.reports;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.cvortex.ats.constants.FrameworkConstants;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class ExtentReportManager {

    private static ExtentReports extentReports;

    private ExtentReportManager() {
    }

    public static synchronized ExtentReports getInstance() {
        if (extentReports == null) {
            extentReports = new ExtentReports();
            Path reportPath = buildReportPath();
            ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportPath.toString());
            sparkReporter.config().setDocumentTitle("CVortex ATS Automation Report");
            sparkReporter.config().setReportName("CVortex ATS System Test Execution");
            extentReports.attachReporter(sparkReporter);
            extentReports.setSystemInfo("Application", "CVortex ATS");
            extentReports.setSystemInfo("Framework", "Selenium + TestNG + Maven");
        }
        return extentReports;
    }

    public static synchronized void flush() {
        if (extentReports != null) {
            extentReports.flush();
        }
    }

    private static Path buildReportPath() {
        try {
            Files.createDirectories(FrameworkConstants.REPORT_DIR);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to create report directory", exception);
        }
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        return FrameworkConstants.REPORT_DIR.resolve("extent-report-" + timestamp + ".html");
    }
}
