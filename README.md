# Professional Finance Dashboard

A full-stack financial management system built with Node.js, Express, MongoDB, and React.

> [!IMPORTANT]
> **Automated Role Security**:
> - The **very first user** to register is automatically granted the **Admin** role.
> - **All subsequent users** default to the **Viewer** role.
> - Admins can manually promote users to analyst,admin and viewer via the User Management panel.

## 🚀 Setup Instructions

### 1. Backend Setup
1.  Navigate to `/backend`
2.  Install dependencies: `npm install`
3.  Configure `.env` file:
    ```env
    PORT=5000
    MONGODB_URI=<YOUR_MONGODB_URI>
    JWT_SECRET=<YOUR_JWT_SECRET>
    ```
4.  Run Server: `npm start`

### 2. Frontend Setup
1.  Navigate to `/frontend`
2.  Install dependencies: `npm install`
3.  Run Dev Server: `npm run dev`

## ✨ Core Features

- **Authentication**: Secure JWT-based login and registration.
- **RBAC**: Three roles: `Viewer` (read-only), `Analyst` (view + filter), `Admin` (full control).
- **Dashboard Summary**: Real-time totals for income, expenses, and net balance.
- **Monthly Trends**: Aggregated side-by-side comparison of monthly income vs. expenses.
- **Category Breakdown**: Automatic grouping of spending by category.
- **Advanced Controls**: Soft delete and search system for records.
- **Admin Panel**: Role management and permanent account deletion.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register`: Create new account
- `POST /api/auth/login`: Authenticate and receive token
- `GET /api/auth`: List users (Admin only)
- `PUT /api/auth/:id`: Update user role/status (Admin only)
- `DELETE /api/auth/:id`: Permanent user removal (Admin only)

### Financial Records
- `GET /api/records`: List records with pagination and search
- `POST /api/records`: Add new record (Admin only)
- `PUT /api/records/:id`: Edit record (Admin only)
- `DELETE /api/records/:id`: Soft delete record (Admin only)

### Dashboard Summaries
- `GET /api/dashboard/summary`: Aggregated dashboard data

## 🧠 Technical Assumptions

- **Currency**: USD formatting used for all amounts.
- **Predefined Categories**: Using a fixed list (Salary, Food, Rent, etc.) for data consistency.
- **Soft Delete**: Default deletion of records preserves data integrity for auditing.

## ⚙️ Technical Decisions and Trade-offs

### 🛠️ Framework & Technology Choice
- **Frontend (React + Vite)**: Chosen for its exceptional speed and developer experience. Compared to Create React App (CRA), **Vite** offers significantly faster build times and Hot Module Replacement (HMR).
- **Backend (Node.js + Express)**: A lightweight, non-blocking foundation that is perfect for real-time dashboards and JSON-heavy APIs.
- **Trade-off**: While Next.js could provide Server Side Rendering (SSR), it was passed over for a **Vite SPA** (Single Page App) to keep the frontend/backend decoupled, making it easier to deploy the backend to serverless platforms in the future.

### 🗄️ Database Strategy (MongoDB + Mongoose)
- **Choice**: Document-oriented NoSQL.
- **Why**: Financial records can vary (additional meta-data, tags, etc.). MongoDB's flexible schema allows the app to evolve without complex SQL migrations.
- **Trade-off**: SQL would provide better transactional integrity (ACID), but for a personal finance dashboard, the **speed and flexibility** of MongoDB outweigh the need for strict relational constraints.

### 🔐 Authentication Approach (JWT)
- **Choice**: Stateless JWT (JSON Web Tokens).
- **Why**: Simplifies deployment and scaling as the server does not need to store session data. It is the modern standard for secure, decoupled API communication.
- **Trade-off**: JWTs cannot be easily "revoked" before they expire. To mitigate this, I implemented an **account status ('inactive')** check on every request to ensure deactivated users are instantly blocked.

### 🏗️ Project Architecture
- **Pattern**: Controller-Route-Middleware.
- **Why**: Clean separation of concerns.
  - **Routes**: Define endpoints.
  - **Controllers**: Handle business logic.
  - **Middleware**: Manages reusable cross-cutting concerns (Auth, Validation, Error Handling).
- **Trade-off**: For a small app, this adds more files, but it ensures the project remains **maintainable and testable** as it grows.

---

### 💡 Final Considerations
- **Soft Delete**: Records are never hard-deleted; they are flagged (`isDeleted: true`). This maintains financial auditability while allowing a "Restore" feature in the future.
- **Server-side Aggregation**: Calculations for "Monthly Trends" are handled by MongoDB aggregation pipelines. This offloads heavy processing from the client’s browser to the server.
