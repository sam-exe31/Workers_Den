# 🛠️ Workers' Den

<p align="center">
  <strong>The complete on-demand platform connecting skilled blue-collar workers with customers.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-4.1.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Java-17-007396?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  
  <img src="https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />

---

##  Overview

**Workers' Den** is a full-stack platform designed to streamline hiring and managing verified blue-collar workers (plumbers, electricians, carpenters, painters, and more). It delivers:
- **Customers**: Effortless job posting, worker discovery, request tracking, and ratings/reviews.
- **Workers**: A dedicated workspace to manage job applications, active assignments, earnings, and profile credentials.
- **Admin**: Category administration, user governance, and platform analytics.

---

##  Repository Structure

```
Workers_Den/
│
├── backend/
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── workersden/
│                       ├── config/         
│                       ├── controller/      
│                       ├── dto/
│                       │   ├── request/    
│                       │   └── response/   
│                       ├── entity/          
│                       ├── exception/      
│                       ├── repository/      
│                       ├── security/        
│                       └── service/         
│
├── frontend/
│   └── src/
│       ├── api/             
│       ├── components/      
│       ├── features/        
│       ├── pages/           
│       ├── context/        
│       ├── theme/           
│       ├── constants/       
│       └── utils/           
│
├── docs/
│   ├── screenshots/         
│   └── architecture.md     
│
├── .github/
│   └── workflows/           
│
├── .gitignore
├── LICENSE
└── README.md
```

---

##  Tech Stack

### Backend
- **Framework**: Spring Boot 4
- **Language**: Java 17
- **Security**: Spring Security 6 with stateless JWT authentication
- **Database**: MySQL 8.x with Spring Data JPA / Hibernate
- **Cloud Storage**: Cloudinary HTTP5 SDK
- **Build Tool**: Apache Maven (via `mvnw`)

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailored CSS Design System with dark mode & micro-animations
- **Routing**: React Router
- **HTTP Client**: Axios / Fetch API

---

##  Getting Started

### Prerequisites
- **Java**: OpenJDK 17 or higher
- **Node.js**: v18.x or v20.x + npm
- **Database**: MySQL Server running locally or via cloud (e.g. Railway, PlanetScale, AWS RDS)
- **Cloudinary**: Free account for cloud media uploads

---

### 1. Database Setup

Create the MySQL database:
```sql
CREATE DATABASE workers_den CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Backend Configuration & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables in your terminal or `.env` file:
   ```env
   MYSQLHOST=localhost
   MYSQLPORT=3306
   MYSQLDATABASE=workers_den
   MYSQLUSER=root
   MYSQLPASSWORD=yourpassword

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Build and launch the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend API will be available at:* `http://localhost:8080`

---

### 3. Frontend Setup & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be live at:* `http://localhost:5173`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new Customer or Worker | ❌ |
| `POST` | `/auth/login` | Authenticate user & receive JWT token | ❌ |
| `GET` | `/api/categories` | Retrieve service categories | ❌ |
| `GET` | `/api/workers` | Search worker profiles by category/rating | ❌ |
| `POST` | `/api/service-requests` | Create a new service job request | ✅ (Customer) |
| `GET` | `/api/service-requests/my` | List current user's job requests | ✅ |
| `PUT` | `/api/service-requests/{id}/accept` | Accept a job request | ✅ (Worker) |
| `PUT` | `/api/service-requests/{id}/status` | Update job lifecycle status | ✅ |
| `POST` | `/api/reviews` | Submit rating & review for completed job | ✅ (Customer) |
| `POST` | `/api/upload` | Upload image attachments to Cloudinary | ✅ |

For detailed architectural workflows and ERD diagrams, refer to [docs/architecture.md](docs/architecture.md).

---

##  Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

> A Samesa Company Product 
