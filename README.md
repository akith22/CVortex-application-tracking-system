### Applicant Tracking System (ATS)

A full-stack Applicant Tracking System (ATS) built to manage job postings, candidate applications, and recruitment workflows.
This project is developed as a portfolio-grade system following clean architecture and industry best practices.

Project Overview

The Applicant Tracking System allows:

Recruiters to create and manage job postings

Candidates to apply for jobs and upload resumes

Administrators to manage users and oversee the system

Secure backend APIs with role-based access control

A modern frontend interface for system interaction

The project is being developed incrementally, following real-world software engineering workflows.



---

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security (JWT planned)
- MySQL
- Hibernate

### Frontend
- React
- Vite
- JavaScript (ES6+)
- HTML5
- CSS3

### Tools
- Git & GitHub
- MySQL Workbench
- Postman

---

## Database Design

The database schema is designed using MySQL Workbench with proper normalization and foreign key constraints.

### Core Tables
- users
- jobs
- applications
- resumes

### Relationships
- One recruiter can create multiple jobs
- One candidate can apply for multiple jobs
- One job can receive multiple applications
- One application is associated with one resume

---

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8 or higher
- Git

---


## Backend Setup

cd ats-system
./mvnw spring-boot:run

Backend runs on:
http://localhost:8080

## Frontend Setup

cd ats-frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

### Backend Setup

