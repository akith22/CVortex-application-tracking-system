package com.ats.atssystem.service;

import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;

import java.util.List;

public interface JobService {

    Job createJob(Job job);

    List<Job> getMyJobs();

    void updateJobStatus(Long jobId, JobStatus status);
}
