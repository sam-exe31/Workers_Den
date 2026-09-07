# Workers Den 🔧

> A full-stack service marketplace connecting customers with local skilled workers — book, track, and manage on-demand services in real time.

 ## Overview

 **Workers Den** is a service-marketplace platform (think Urban Company / TaskRabbit) that lets customers post service requests and lets verified workers browse, accept, and complete jobs — with real-time status tracking from `OPEN → ACCEPTED → IN_PROGRESS → COMPLETED`.

 Built to explore secure, scalable full-stack architecture: JWT-based auth, role-based access control, relational data modeling for a two-sided marketplace, and cloud-based media handling.

 ---

 ##  Features

-  **Secure authentication** — JWT-based login/signup with Spring Security, role-based access (Customer / Worker)
-  **Job lifecycle management** — create, accept, start, complete, and cancel service requests with state validation
-  **Worker profiles** — category-based service offerings, availability toggling, capacity limits
- **Photo uploads** 📸— job photos handled via Cloudinary integration
-  **Locality-based job matching** — workers see only relevant, available jobs in their categories
-  **Robust error handling** — custom exceptions for invalid state transitions, unauthorized actions, and not-found resources
-  **Clean layered architecture** — Controller → Service → Repository, DTO-based request/response contracts
---


##  Tech Stack
 
| Layer | Technology |
|---|---|
| **Backend** | Java 17, Spring Boot, Spring Security, Spring Data JPA |
| **Auth** | JWT (JSON Web Tokens) |
| **Database** | MySQL |
| **Frontend** | React, REST API integration |
| **Media Storage** | Cloudinary |
| **Build Tool** | Maven |
| **Deployment** | Docker, Render |
 
---

##  Project Structure
 
```
Workers_Den/
├── backend/                         
│   ├── src/main/java/org/example/workers_backend_services/
│   │   ├── config/                  
│   │   ├── controller/               
│   │   ├── dto/                      
│   │   ├── entity/                  
│   │   ├── exception/                  
│   │   ├── repository/                 
│   │   └── service/                     
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                        
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/                  
│   │   └── App.jsx
│   └── package.json
│
├── docs/                              
├── .gitignore
├── LICENSE
└── README.md
```
 
---


 
##  Getting Started
 
### Prerequisites
- Java 17+
- Maven
- MySQL 8+
- Node.js 18+ & npm
- A [Cloudinary](https://cloudinary.com) account (free tier works)
### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/Workers_Den.git
cd Workers_Den
```
 
### 2. Backend setup
```bash
cd backend
```
Create a `.env` (or set these as environment variables):
```
DB_URL=jdbc:mysql://localhost:3306/workers_den
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run it:
```bash
mvn clean install
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.
 
### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173` (or your configured port).
 
---
 
##  API Overview
 
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate & receive JWT |
| `POST` | `/api/service-requests` | Create a new job (Customer) |
| `GET` | `/api/service-requests/available` | View open jobs (Worker) |
| `POST` | `/api/service-requests/{id}/accept` | Accept a job (Worker) |
| `POST` | `/api/service-requests/{id}/start` | Start a job |
| `POST` | `/api/service-requests/{id}/complete` | Mark job complete |
| `POST` | `/api/service-requests/{id}/cancel` | Cancel a job |
| `POST` | `/api/uploads/photo` | Upload job photo to Cloudinary |
 
*(Full API documentation coming soon ..)*
 
---
 
##  Roadmap
 
- [ ] Add Swagger/OpenAPI docs
- [ ] Ratings & reviews for workers
- [ ] In-app notifications
- [ ] Payment gateway integration
- [ ] Admin dashboard for category/user management
---
 

 
##  Author
 
**Samarth Ghate**
Computer Engineering pune

> A samesa company product
 
