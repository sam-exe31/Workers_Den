# Workers' Den - System Architecture

This document provides a comprehensive overview of the **Workers' Den** platform architecture, detailing the backend system structure, component interactions, security model, and data schemas.

---

## 1. High-Level Architecture Overview

Workers' Den is designed as a decoupled client-server architecture:
- **Frontend**: Single Page Application built with modern React / Vite, providing customer, worker, and admin interfaces.
- **Backend**: Spring Boot 4 REST API powering business logic, user authentication, service lifecycle management, and ratings.
- **Storage & Infrastructure**:
  - **MySQL**: Relational storage for users, worker profiles, categories, service requests, and reviews.
  - **Cloudinary**: Cloud-based storage for job attachments and worker profile images.

```mermaid
graph TD
    Client[React Frontend / Vite] -->|HTTPS / JSON REST API| Gateway[Spring Boot Backend]
    Gateway --> Security[Spring Security & JWT Filter]
    Security --> Controllers[REST Controllers]
    Controllers --> Services[Service Layer / Business Logic]
    Services --> Repositories[Spring Data JPA Repositories]
    Repositories --> DB[(MySQL Database)]
    Services --> Cloudinary[(Cloudinary Media Storage)]
```

---

## 2. Backend Package Structure (`com.workersden`)

The backend follows clean layered architecture principles organized under `com.workersden`:

```
backend/src/main/java/com/workersden/
├── config/                  # Configuration beans (Cloudinary, Web MVC, Database Seeder)
├── controller/              # REST API Controllers (endpoints for Auth, Users, Jobs, Reviews)
├── dto/
│   ├── request/             # Request payload DTOs with validation annotations
│   └── response/            # Response payload DTOs for client consumption
├── entity/                  # JPA Database Entities & Enums (Role, ServiceStatus, etc.)
├── exception/               # Global Exception Handler and custom runtime exceptions
├── repository/              # Spring Data JPA Repository interfaces
├── security/                # JWT Utilities, JWT Authentication Filter, Security Filter Chain
└── service/                 # Service interfaces and business logic implementations
```

---

## 3. Security & Authentication Flow

Workers' Den uses stateless JSON Web Token (JWT) based authentication:

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Worker
    participant Frontend as React Client
    participant AuthCtrl as AuthController
    participant Sec as Security / JwtUtil
    participant DB as MySQL Database

    User->>Frontend: Enter credentials (Email, Password)
    Frontend->>AuthCtrl: POST /auth/login
    AuthCtrl->>Sec: Validate Credentials
    Sec->>DB: Query User by Email
    DB-->>Sec: User Details & Hashed Password
    Sec-->>AuthCtrl: Authentication Success (Generate JWT)
    AuthCtrl-->>Frontend: Returns LoginResponseDTO (token, user details, role)
    Frontend->>Frontend: Store Token (localStorage / state)

    Note over Frontend,AuthCtrl: Subsequent Authenticated Requests
    Frontend->>AuthCtrl: Request with Header `Authorization: Bearer <token>`
    AuthCtrl->>Sec: JwtAuthFilter intercepts & validates token
    Sec->>AuthCtrl: Set SecurityContextHolder
    AuthCtrl-->>Frontend: Return Protected Resource
```

---

## 4. Entity-Relationship Model (Domain)

```mermaid
erDiagram
    Users ||--o{ Workerprofile : "has profile (if WORKER)"
    Users ||--o{ Service_request : "customer creates"
    Workerprofile ||--o{ Service_request : "worker accepts"
    Service_request ||--o{ Reviews : "receives"
    Users ||--o{ Reviews : "writes"
    Category ||--o{ Workercategory : "classifies"
    Category ||--o{ Service_request : "categorized under"
    Workercategory ||--o{ Workerprofile : "assigned to"
    Service_request ||--o{ JobPhoto : "contains photos"

    Users {
        Long id PK
        String name
        String email
        String password
        Role role
        String phone
        String address
    }

    Workerprofile {
        Long id PK
        Long userId FK
        String bio
        Double hourlyRate
        Double rating
        Integer experienceYears
    }

    Category {
        Long id PK
        String name
        String description
        String iconUrl
    }

    Service_request {
        Long id PK
        Long customerId FK
        Long workerId FK
        Long categoryId FK
        String title
        String description
        ServiceStatus status
        Double estimatedCost
        LocalDateTime createdAt
    }

    Reviews {
        Long id PK
        Long serviceRequestId FK
        Long customerId FK
        Long workerId FK
        Integer rating
        String comment
    }
```

---

## 5. Service Request Lifecycle State Machine

Service requests transition through explicit, validated states:

```mermaid
stateDiagram-v2
    [*] --> PENDING: Customer Creates Request
    PENDING --> ACCEPTED: Worker Accepts Request
    PENDING --> CANCELLED: Customer Cancels
    ACCEPTED --> IN_PROGRESS: Work Started
    ACCEPTED --> CANCELLED: Cancelled (with reason)
    IN_PROGRESS --> COMPLETED: Work Completed
    COMPLETED --> REVIEWED: Customer Leaves Review
    REVIEWED --> [*]
    CANCELLED --> [*]
```

---

## 6. Media Upload Flow (Cloudinary)

1. Client uploads job/profile image via `POST /api/upload`.
2. Backend receives `MultipartFile`, verifies size and MIME type.
3. Service streams the file to Cloudinary via `com.cloudinary:cloudinary-http5`.
4. Secure CDN URL is returned to the client and saved in entity records (`JobPhoto`, `Workerprofile`).
