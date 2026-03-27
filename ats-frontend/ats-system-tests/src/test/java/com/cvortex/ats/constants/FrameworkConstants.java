package com.cvortex.ats.constants;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

public final class FrameworkConstants {

    private FrameworkConstants() {
    }

    public static final Path PROJECT_ROOT = Paths.get(System.getProperty("user.dir"));
    public static final Path SCREENSHOT_DIR = PROJECT_ROOT.resolve("screenshots");
    public static final Path REPORT_DIR = PROJECT_ROOT.resolve("reports");
    public static final Path TEST_DATA_DIR = PROJECT_ROOT.resolve("src").resolve("test").resolve("resources").resolve("testdata");
    public static final Path TEST_FILES_DIR = PROJECT_ROOT.resolve("src").resolve("test").resolve("resources").resolve("test-files");
    public static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(15);
    public static final Duration SMALL_TIMEOUT = Duration.ofSeconds(5);
    public static final Duration LARGE_TIMEOUT = Duration.ofSeconds(30);
    public static final String CONFIG_FILE = "config/config.properties";
    public static final String USERS_JSON = "testdata/users.json";
    public static final String JOBS_JSON = "testdata/jobs.json";
    public static final String TESTDATA_PROPERTIES = "testdata/testdata.properties";
}
