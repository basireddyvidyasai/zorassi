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

## ⚙️ Tradeoffs Considered

- **Soft Delete vs. Hard Delete**: Chose soft delete for records to prevent data loss while implementing hard delete for users to satisfy privacy requirements.
- **Real-time Aggregation**: Used MongoDB aggregation pipelines on the server instead of client-side filtering to ensure high performance with large datasets.
- **Vanilla CSS over Tailwind**: Selected Vanilla CSS for complete design control and to avoid build-time complexities for this specific evaluation.
- **Vite over CRA**: Used Vite for significantly faster development cycles and HMR support.
