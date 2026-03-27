package com.cvortex.ats.retry;

import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

public class RetryAnalyzer implements IRetryAnalyzer {

    private int currentRetryCount;

    @Override
    public boolean retry(ITestResult result) {
        int maxRetryCount = Integer.parseInt(System.getProperty("retry.count", "1"));
        if (currentRetryCount < maxRetryCount) {
            currentRetryCount++;
            return true;
        }
        return false;
    }
}
