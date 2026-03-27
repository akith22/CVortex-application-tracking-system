package com.cvortex.ats.utils;

import org.testng.Assert;

public final class AssertionUtil {

    private AssertionUtil() {
    }

    public static void assertContains(String actual, String expected, String message) {
        Assert.assertTrue(actual.contains(expected), message + " Actual value: " + actual);
    }

    public static void assertNotBlank(String actual, String message) {
        Assert.assertNotNull(actual, message);
        Assert.assertFalse(actual.isBlank(), message);
    }
}
