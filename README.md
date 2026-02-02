# 🧠 CVortex - Application Tracking System

<div align="center">

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

A full-stack Application Tracking System built with Spring Boot, JWT authentication, role-based access control, and React (Vite). The system supports Admins, Recruiters, and Candidates, each with clearly separated responsibilities.

</div>

---

## 🚀 Features Overview

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (`ADMIN`, `RECRUITER`, `CANDIDATE`)
- Secure REST APIs
- Stateless session management

### 👤 Candidate Features
- View and update profile
- Browse open job vacancies
- Apply for jobs
- Upload resumes
- Track application status

### 🧑‍💼 Recruiter Features
- View and update profile
- Create job vacancies
- Update job status (OPEN / CLOSED)
- View applicants per job
- Access candidate resumes
- Manage application statuses

### 🛠️ Admin Features
- System overview dashboard
- View all users
- View all jobs
- Monitor platform statistics

---

## 🧱 Technology Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT (jjwt)
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React
- Vite
- Axios
- JWT token handling

### Tools
- MySQL Workbench
- Postman
- Git & GitHub

---

## 🗂️ Project Structure

### Backend
```
ats-system/
├── controller
├── service
│   └── impl
├── repository
├── model
├── dto
├── security
└── resources
```

### Frontend
```
ats-frontend/
└── ats-frontend/
    ├── src
    │   ├── api
    │   ├── pages
    │   ├── components
    │   └── App.jsx
```

---

## 🗄️ Database Design

The database is designed using an EER diagram and includes:
- `users`
- `jobs`
- `applications`
- `resumes`

### Key Relationships
- One Recruiter → many Jobs
- One Candidate → many Applications
- One Job → many Applications
- One Application → one Resume

---

## ▶️ How to Run the Application

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/akith22/CVortex-application-tracking-system.git
cd CVortex-aplication-tracking-system
```

### 2️⃣ Set Up the Database (IMPORTANT)

> ⚠️ This project uses a manually forward-engineered database.

**Steps:**
1. Open **MySQL Workbench**
2. Go to **File → Open Model**
3. Open the provided **EER diagram** (.mwb file)
4. Click **Database → Forward Engineer**
5. Select your MySQL connection
6. Create the schema (e.g., `ats_db`)
7. Execute the generated SQL

> **Do NOT rely on Hibernate auto-DDL.** Database structure must match the EER diagram exactly.

### 3️⃣ Configure Backend

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ats_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

### 4️⃣ Run Backend

```bash
cd ats-system
./mvnw spring-boot:run
```

Backend runs on: **http://localhost:8080**

### 5️⃣ Run Frontend

```bash
cd ats-frontend/ats-frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 🔑 Authentication Flow

1. User registers (`/auth/register`)
2. User logs in (`/auth/login`)
3. JWT token is returned
4. Token must be sent in headers:
   ```
   Authorization: Bearer <JWT_TOKEN>
   ```

---

## 🔐 Role-Based API Access

| Role | Allowed Endpoints |
|------|-------------------|
| **ADMIN** | `/admin/**` |
| **RECRUITER** | `/recruiter/**` |
| **CANDIDATE** | `/candidate/**` |

Unauthorized access returns **403 Forbidden**.

---

## 📌 Notes

- Passwords are securely hashed
- JWT contains email and role
- CORS configured for frontend
- Clean separation of responsibilities
- Designed to reflect real-world ATS systems

---

## 📄 License

This project is for educational and portfolio purposes.

---

## ✨ Author

**Akith De Silva**  
Computer Science Undergraduate  
Sri Lanka Institute of Information Technology (SLIIT)

🐙 GitHub: [@akith22](https://github.com/akith22)

---



