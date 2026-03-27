package com.cvortex.ats.listeners;

import com.aventstack.extentreports.Status;
import com.cvortex.ats.driver.DriverFactory;
import com.cvortex.ats.reports.ExtentReportManager;
import com.cvortex.ats.reports.ExtentTestManager;
import com.cvortex.ats.utils.ScreenshotUtil;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener {

    @Override
    public void onStart(ITestContext context) {
        ExtentReportManager.getInstance();
    }

    @Override
    public void onTestStart(ITestResult result) {
        String testName = result.getMethod().getMethodName();
        ExtentTestManager.setTest(ExtentReportManager.getInstance().createTest(testName, result.getMethod().getDescription()));
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        ExtentTestManager.getTest().log(Status.PASS, "Test passed");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        ExtentTestManager.getTest().log(Status.FAIL, result.getThrowable());
        try {
            String path = ScreenshotUtil.capture(DriverFactory.getDriver(), result.getMethod().getMethodName());
            ExtentTestManager.getTest().addScreenCaptureFromPath(path);
        } catch (Exception exception) {
            ExtentTestManager.getTest().log(Status.WARNING, "Unable to capture screenshot: " + exception.getMessage());
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        ExtentTestManager.getTest().log(Status.SKIP, result.getThrowable());
    }

    @Override
    public void onFinish(ITestContext context) {
        ExtentReportManager.flush();
        ExtentTestManager.unload();
    }
}
