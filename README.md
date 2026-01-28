📌 Applicant Tracking System (ATS)

A full-stack Applicant Tracking System (ATS) designed to manage job postings, candidate applications, and recruitment workflows.
This project is built as a portfolio-grade system following clean architecture and industry best practices.

🚀 Project Overview

The Applicant Tracking System allows:

Recruiters to create and manage job postings

Candidates to apply for jobs and upload resumes

Administrators to manage users and oversee the system

Secure backend APIs with role-based access control

A modern frontend for interacting with the system

This project is being developed incrementally, following a real-world software engineering workflow.

🏗️ Project Structure
application-tracking-system/
├── ats-system/              # Spring Boot backend
│   ├── src/main/java
│   ├── src/main/resources
│   └── pom.xml
│
├── ats-frontend/            # React (Vite) frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

🧰 Tech Stack
Backend

Java 17

Spring Boot 4

Spring Data JPA

Spring Security (JWT – planned)

MySQL

Hibernate 7

Frontend

React

Vite

JavaScript (ES6+)

HTML5 / CSS3

Tools

Git & GitHub

MySQL Workbench

Postman

🗄️ Database Design

The database is designed using MySQL Workbench (EER Diagram) with proper normalization and foreign key constraints.

Core Entities

users

jobs

applications

resumes

Key Relationships

A recruiter (user) can create many jobs

A candidate (user) can apply to many jobs

A job can have many applications

Each application can have one resume

🔐 Authentication & Authorization (Planned)

JWT-based authentication

Role-based access control:

ADMIN

RECRUITER

CANDIDATE

⚙️ Setup Instructions
Prerequisites

Java 17+

Node.js 18+

MySQL 8+

Git

Backend Setup
cd ats-system
./mvnw spring-boot:run


Backend runs on:

http://localhost:8080

Frontend Setup
cd ats-frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173
