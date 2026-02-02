package com.ats.atssystem.dto;

/**
 * DTO for Admin Dashboard Statistics (Phase A1)
 *
 * Returns summary counts for:
 * - Total users (recruiters + candidates)
 * - Recruiters count
 * - Candidates count
 * - Total jobs
 * - Open jobs
 * - Closed jobs
 */
public class AdminDashboardStatsDTO {

    private Long totalUsers;
    private Long recruiters;
    private Long candidates;
    private Long totalJobs;
    private Long openJobs;
    private Long closedJobs;

    public AdminDashboardStatsDTO() {
    }

    public AdminDashboardStatsDTO(Long totalUsers, Long recruiters, Long candidates,
                                  Long totalJobs, Long openJobs, Long closedJobs) {
        this.totalUsers = totalUsers;
        this.recruiters = recruiters;
        this.candidates = candidates;
        this.totalJobs = totalJobs;
        this.openJobs = openJobs;
        this.closedJobs = closedJobs;
    }

    // Getters and Setters

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getRecruiters() {
        return recruiters;
    }

    public void setRecruiters(Long recruiters) {
        this.recruiters = recruiters;
    }

    public Long getCandidates() {
        return candidates;
    }

    public void setCandidates(Long candidates) {
        this.candidates = candidates;
    }

    public Long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(Long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public Long getOpenJobs() {
        return openJobs;
    }

    public void setOpenJobs(Long openJobs) {
        this.openJobs = openJobs;
    }

    public Long getClosedJobs() {
        return closedJobs;
    }

    public void setClosedJobs(Long closedJobs) {
        this.closedJobs = closedJobs;
    }
}