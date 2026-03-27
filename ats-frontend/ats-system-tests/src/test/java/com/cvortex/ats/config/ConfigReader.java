package com.cvortex.ats.config;

import com.cvortex.ats.constants.FrameworkConstants;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;

public final class ConfigReader {

    private static final Properties PROPERTIES = new Properties();

    static {
        loadBaseProperties();
    }

    private ConfigReader() {
    }

    private static void loadBaseProperties() {
        try (InputStream inputStream = ConfigReader.class.getClassLoader().getResourceAsStream(FrameworkConstants.CONFIG_FILE)) {
            if (Objects.isNull(inputStream)) {
                throw new IllegalStateException("Unable to find configuration file: " + FrameworkConstants.CONFIG_FILE);
            }
            PROPERTIES.load(inputStream);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to load framework configuration", exception);
        }
    }

    public static String get(String key) {
        String systemValue = System.getProperty(key);
        if (systemValue != null && !systemValue.isBlank()) {
            return systemValue.trim();
        }
        String envValue = System.getenv(key.replace('.', '_').toUpperCase());
        if (envValue != null && !envValue.isBlank()) {
            return envValue.trim();
        }
        return PROPERTIES.getProperty(key, "").trim();
    }

    public static int getInt(String key) {
        return Integer.parseInt(get(key));
    }

    public static boolean getBoolean(String key) {
        return Boolean.parseBoolean(get(key));
    }
}
