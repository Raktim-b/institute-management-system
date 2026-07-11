# 🎓 Institute Management System API

> A complete **Institute Management System Backend API** built with **Node.js, Express.js, MongoDB, Mongoose, JWT, and Nodemailer** that helps educational institutes manage students, teachers, courses, batches, enrollments, attendance, examinations, and reports through secure role-based access.

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,javascript,git,github,vscode" />
</p>

---

# 📖 Project Overview

Managing an educational institute manually can become difficult as the number of students and teachers grows.

This project provides a secure REST API that allows administrators, teachers, and students to perform their respective operations through Role-Based Access Control (RBAC).

The system includes:

- User Authentication
- Email Verification
- Course Management
- Batch Management
- Student Enrollment
- Attendance Tracking
- Examination Management
- Performance Reports
- Email Report Generation

---

# ✨ Features

## 👤 Authentication

- User Signup
- Email Verification
- Login using JWT
- Authorization Middleware
- Role Based Access
- Password Encryption using bcrypt

---

## 👥 User Management

- Student Registration
- Teacher Registration
- Admin Management
- Profile Update
- Profile Picture Upload
- Contact Information Update
- View Profile
- List Users (Admin Only)

---

## 📚 Course Management

- Create Course
- Update Course
- Delete Course
- View All Courses
- Total Enrolled Students
- Total Batches Per Course

---

## 🏫 Batch Management

- Create Batch
- Assign Teacher
- Assign Students
- Update Batch
- Delete Batch
- List Batch Details

---

## 📝 Enrollment

- Student Enrollment
- Course Enrollment History

---

## 📅 Attendance Management

- Mark Attendance
- Attendance Percentage
- Student Attendance History
- Batch Attendance Report

---

## 📝 Examination Management

- Create Exam
- Assign Student Marks
- Update Exam
- Student Result
- Batch Result

---

## 📊 Reports

- Course Enrollment Report
- Batch Performance Report
- Student Performance Report
- Email Student Performance Report

---

# 🔐 Roles

| Role | Permissions |
|------|-------------|
| Admin | Full Access |
| Teacher | Manage Attendance, Exams & Batches |
| Student | View Profile, Attendance & Results |

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Nodemailer | Email Verification |
| Multer | File Upload |
| dotenv | Environment Variables |
| Morgan | Logging |
| Express Validator / Joi | Validation |

---

# 📂 Project Structure

```text
Institute-Management-System/
│
├── app/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── emailVerify.js
│   │
│   ├── controller/
│   │   ├── attendance.controller.js
│   │   ├── auth.controller.js
│   │   ├── batch.controller.js
│   │   ├── course.controller.js
│   │   ├── exam.controller.js
│   │   ├── report.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── allowRoles.js
│   │   ├── auth.js
│   │   ├── fileUpload.js
│   │   └── rateLimiter.js
│   │
│   ├── model/
│   │   ├── attendanceModel.js
│   │   ├── batchModel.js
│   │   ├── courseModel.js
│   │   ├── enrollmentModel.js
│   │   ├── examModel.js
│   │   ├── roleModel.js
│   │   ├── userModel.js
│   │   └── verificationModel.js
│   │
│   ├── routes/
│   │   ├── attendance.routes.js
│   │   ├── auth.routes.js
│   │   ├── batch.routes.js
│   │   ├── course.routes.js
│   │   ├── exam.routes.js
│   │   ├── report.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── httpStatusCode.js
│   │   ├── logger.js
│   │   ├── sendEmail.js
│   │   └── sendStudentReport.js
│   │
│   └── validation/
│       ├── authValidation.js
│       ├── batchValidation.js
│       └── courseValidation.js
│
├── Postman/
│
├── uploads/
│
├── public/
│
├── .env
├── .gitignore
├── app.js
├── combined.log
└── README.md
```

---

# 📦 Database Collections

```
Users
Roles
Courses
Batches
Enrollments
Attendance
Exams
Verification
```

---

# 🔗 API Modules

## Authentication

```
POST    /auth/signup
GET     /auth/verify/:token
POST    /auth/login
```

---

## Users

```
GET     /users/profile
PUT     /users/profile
GET     /users
```

---

## Courses

```
POST    /courses
GET     /courses
PUT     /courses/:id
DELETE  /courses/:id
```

---

## Batches

```
POST    /batches
GET     /batches
PUT     /batches/:id
DELETE  /batches/:id
POST    /batches/assign-students
```

---

## Attendance

```
POST    /attendance
GET     /attendance/student/:id
GET     /attendance/batch/:id
```

---

## Exams

```
POST    /exams
PUT     /exams/:id
POST    /exams/marks
GET     /exams/student/:id
GET     /exams/batch/:id
```

---

## Reports

```
GET     /reports/course-enrollments
GET     /reports/batch-performance/:id
GET     /reports/student-performance/:id
POST    /reports/send-report/:studentId
```

---

# 📧 Email Features

✅ Email Verification

✅ Student Performance Report

✅ HTML Table Email

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Role-Based Authorization
- Request Validation
- Protected Routes
- File Upload Validation
- Rate Limiting

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/institute-management-system.git
```

---

## Move into Project

```bash
cd institute-management-system
```

---

## Install Packages

```bash
npm install
```

---

## Create Environment Variables

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

EMAIL=

EMAIL_PASSWORD=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## Start Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 📮 Postman Collection

A complete Postman collection is included inside the project.

```
Postman/
```

Import it into Postman to test all APIs.

---

# 📸 Modules Covered

- ✅ Authentication
- ✅ Email Verification
- ✅ User Management
- ✅ Course Management
- ✅ Batch Management
- ✅ Enrollment
- ✅ Attendance
- ✅ Examination
- ✅ Reports
- ✅ Student Performance Email

---

# 📈 Future Improvements

- Dashboard Analytics
- Student Fee Management
- Assignment Submission
- Online Examination
- Notification System
- PDF Report Generation
- Admin Dashboard
- Pagination & Search
- Swagger API Documentation

---

# 👨‍💻 Author

**Raktim Bhattacharya**

Backend Developer

Built with ❤️ using **Node.js, Express.js & MongoDB**
