package com.cvortex.ats.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;

public final class ResourcePropertyReader {

    private ResourcePropertyReader() {
    }

    public static Properties load(String resourcePath) {
        Properties properties = new Properties();
        try (InputStream inputStream = ResourcePropertyReader.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (Objects.isNull(inputStream)) {
                throw new IllegalStateException("Missing properties resource: " + resourcePath);
            }
            properties.load(inputStream);
            return properties;
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to load properties resource: " + resourcePath, exception);
        }
    }
}
