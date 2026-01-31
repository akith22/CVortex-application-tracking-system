package com.ats.atssystem.service;

import com.ats.atssystem.model.Job;

import java.util.List;

public interface JobService {

    Job createJob(Job job);

    List<Job> getMyJobs();

    void closeJob(Long jobId);
}
