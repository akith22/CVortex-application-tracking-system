package com.cvortex.ats.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SeededJobData {

    private Long jobsId;
    private String title;
    private String location;
    private String status;

    public Long getJobsId() {
        return jobsId;
    }

    public void setJobsId(Long jobsId) {
        this.jobsId = jobsId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
