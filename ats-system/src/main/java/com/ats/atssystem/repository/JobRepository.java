package com.ats.atssystem.repository;

import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter(User recruiter);
}
