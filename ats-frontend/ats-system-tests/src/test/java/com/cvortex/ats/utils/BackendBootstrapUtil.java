package com.cvortex.ats.utils;

import com.cvortex.ats.config.ConfigReader;
import com.cvortex.ats.constants.FrameworkConstants;
import com.cvortex.ats.models.JobData;
import com.cvortex.ats.models.SeededJobData;
import com.cvortex.ats.models.UserData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.UUID;

public final class BackendBootstrapUtil {

    private static final HttpClient CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private BackendBootstrapUtil() {
    }

    public static void ensureUserRegistered(UserData user) {
        try {
            String payload = OBJECT_MAPPER.writeValueAsString(user);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ConfigReader.get("backend.base.url") + "/auth/register"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200 || response.statusCode() == 201) {
                return;
            }
            if (response.statusCode() == 400 && response.body().toLowerCase().contains("exists")) {
                return;
            }
            throw new IllegalStateException("Unable to register user " + user.getEmail() + ": " + response.statusCode() + " -> " + response.body());
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to register bootstrap user " + user.getEmail(), exception);
        }
    }

    public static String login(UserData user) {
        try {
            String payload = OBJECT_MAPPER.writeValueAsString(new LoginPayload(user.getEmail(), user.getPassword()));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ConfigReader.get("backend.base.url") + "/auth/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new IllegalStateException("Unable to login bootstrap user " + user.getEmail() + ": " + response.statusCode() + " -> " + response.body());
            }
            JsonNode jsonNode = OBJECT_MAPPER.readTree(response.body());
            return jsonNode.get("token").asText();
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to login bootstrap user " + user.getEmail(), exception);
        }
    }

    public static SeededJobData ensureOpenJob(UserData recruiter) {
        ensureUserRegistered(recruiter);
        String token = login(recruiter);
        try {
            HttpRequest getJobsRequest = HttpRequest.newBuilder()
                    .uri(URI.create(ConfigReader.get("backend.base.url") + "/recruiter/jobs"))
                    .header("Authorization", "Bearer " + token)
                    .GET()
                    .build();
            HttpResponse<String> jobsResponse = CLIENT.send(getJobsRequest, HttpResponse.BodyHandlers.ofString());
            if (jobsResponse.statusCode() == 200) {
                JsonNode jobs = OBJECT_MAPPER.readTree(jobsResponse.body());
                for (JsonNode job : jobs) {
                    if ("OPEN".equalsIgnoreCase(job.path("status").asText())) {
                        return OBJECT_MAPPER.treeToValue(job, SeededJobData.class);
                    }
                }
            }

            JobData jobData = TestDataFactory.buildUniqueJob();
            String payload = OBJECT_MAPPER.writeValueAsString(jobData);
            HttpRequest createJobRequest = HttpRequest.newBuilder()
                    .uri(URI.create(ConfigReader.get("backend.base.url") + "/recruiter/jobs"))
                    .header("Authorization", "Bearer " + token)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();
            HttpResponse<String> createJobResponse = CLIENT.send(createJobRequest, HttpResponse.BodyHandlers.ofString());
            if (createJobResponse.statusCode() != 200 && createJobResponse.statusCode() != 201) {
                throw new IllegalStateException("Unable to create bootstrap job: " + createJobResponse.statusCode() + " -> " + createJobResponse.body());
            }
            return OBJECT_MAPPER.readValue(createJobResponse.body(), SeededJobData.class);
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to ensure recruiter open job", exception);
        }
    }

    public static void ensureCandidateApplication(UserData candidate, UserData recruiter) {
        ensureUserRegistered(candidate);
        ensureUserRegistered(recruiter);
        SeededJobData job = ensureOpenJob(recruiter);
        String token = login(candidate);
        try {
            HttpRequest applicationsRequest = HttpRequest.newBuilder()
                    .uri(URI.create(ConfigReader.get("backend.base.url") + "/candidate/applications"))
                    .header("Authorization", "Bearer " + token)
                    .GET()
                    .build();
            HttpResponse<String> applicationsResponse = CLIENT.send(applicationsRequest, HttpResponse.BodyHandlers.ofString());
            if (applicationsResponse.statusCode() == 200) {
                JsonNode applications = OBJECT_MAPPER.readTree(applicationsResponse.body());
                for (JsonNode application : applications) {
                    if (job.getJobsId().equals(application.path("jobId").asLong())) {
                        return;
                    }
                }
            }

            uploadApplication(token, job.getJobsId());
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to ensure candidate application data", exception);
        }
    }

    public static void ensureAdminViewData(UserData admin, UserData recruiter, UserData candidate) {
        ensureUserRegistered(admin);
        ensureUserRegistered(recruiter);
        ensureUserRegistered(candidate);
        ensureOpenJob(recruiter);
    }

    private static void uploadApplication(String token, Long jobId) throws IOException, InterruptedException {
        String boundary = "----CVortexBoundary" + UUID.randomUUID();
        Path filePath = FrameworkConstants.TEST_FILES_DIR.resolve(ConfigReader.get("sample.resume.file"));
        byte[] fileBytes = Files.readAllBytes(filePath);

        String partOne = "--" + boundary + "\r\n"
                + "Content-Disposition: form-data; name=\"jobId\"\r\n\r\n"
                + jobId + "\r\n"
                + "--" + boundary + "\r\n"
                + "Content-Disposition: form-data; name=\"file\"; filename=\"" + filePath.getFileName() + "\"\r\n"
                + "Content-Type: application/pdf\r\n\r\n";
        String partThree = "\r\n--" + boundary + "--\r\n";

        byte[] requestBody = concatenate(
                partOne.getBytes(StandardCharsets.UTF_8),
                fileBytes,
                partThree.getBytes(StandardCharsets.UTF_8)
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ConfigReader.get("backend.base.url") + "/candidate/applications"))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(requestBody))
                .build();

        HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200 && response.statusCode() != 201) {
            if (response.statusCode() == 409) {
                return;
            }
            throw new IllegalStateException("Unable to create bootstrap application: " + response.statusCode() + " -> " + response.body());
        }
    }

    private static byte[] concatenate(byte[]... arrays) {
        int totalLength = 0;
        for (byte[] array : arrays) {
            totalLength += array.length;
        }
        byte[] result = new byte[totalLength];
        int currentPosition = 0;
        for (byte[] array : arrays) {
            System.arraycopy(array, 0, result, currentPosition, array.length);
            currentPosition += array.length;
        }
        return result;
    }

    private record LoginPayload(String email, String password) {
    }
}
