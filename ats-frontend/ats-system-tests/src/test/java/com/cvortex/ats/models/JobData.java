package com.cvortex.ats.models;

public class JobData {

    private String title;
    private String location;
    private String type;
    private String description;
    private String status;

    public static Builder builder() {
        return new Builder();
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public static final class Builder {
        private final JobData target = new JobData();

        public Builder title(String value) {
            target.title = value;
            return this;
        }

        public Builder location(String value) {
            target.location = value;
            return this;
        }

        public Builder type(String value) {
            target.type = value;
            return this;
        }

        public Builder description(String value) {
            target.description = value;
            return this;
        }

        public Builder status(String value) {
            target.status = value;
            return this;
        }

        public JobData build() {
            return target;
        }
    }
}
