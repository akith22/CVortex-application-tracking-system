package com.cvortex.ats.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Objects;

public final class JsonDataReader {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private JsonDataReader() {
    }

    public static <T> T readObject(String resourcePath, Class<T> type) {
        try (InputStream inputStream = JsonDataReader.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (Objects.isNull(inputStream)) {
                throw new IllegalStateException("Missing JSON resource: " + resourcePath);
            }
            return OBJECT_MAPPER.readValue(inputStream, type);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read JSON resource: " + resourcePath, exception);
        }
    }

    public static <T> List<T> readList(String resourcePath, TypeReference<List<T>> typeReference) {
        try (InputStream inputStream = JsonDataReader.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (Objects.isNull(inputStream)) {
                throw new IllegalStateException("Missing JSON resource: " + resourcePath);
            }
            return OBJECT_MAPPER.readValue(inputStream, typeReference);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read JSON resource: " + resourcePath, exception);
        }
    }
}
