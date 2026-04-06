<div align="center">
  
# 📊 Professional Finance Dashboard

[![React](https://img.shields.io/badge/React-19.2.4-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

*A full-stack, comprehensive financial management system built to track income, expenses, and overall balance with Role-Based Access Control.*

</div>

---

> [!IMPORTANT]
> **Automated Role Security**:
> - The **very first user** to register is automatically granted the **Admin** role.
> - **All subsequent users** default to the **Viewer** role.
> - Admins can manually promote users to `Analyst`, `Admin` or `Viewer` via the User Management panel.

## ✨ Core Features

*   🔒 **Robust Authentication**: Secure JWT-based login and registration with Bcrypt password hashing.
*   🛡️ **Role-Based Access Control (RBAC)**: Three distinct roles: 
    *   `Viewer` (Read-only access)
    *   `Analyst` (View & Filter access)
    *   `Admin` (Full control, User Management)
*   📈 **Real-Time Dashboard**: Visual summaries showing totals for income, expenses, and net balance instantly.
*   📊 **Visual Analytics**: Interactive charts (powered by Chart.js) for monthly comparisons and category breakdowns.
*   🏷️ **Smart Categorization**: Automatic grouping of spending by predefined categories (Salary, Food, Rent, etc.).
*   🔍 **Advanced Search & Filtering**: easily find specific records with an advanced soft-delete system keeping audit trails clean.
*   👥 **Admin Panel**: Full dashboard for managing user access and roles.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React** (v19) | Component-based UI library for dynamic rendering. |
| **Vite** (v5) | Blazing fast build tool and development server. |
| **React Router** | Client-side routing for seamless navigation. |
| **Chart.js** | Interactive and responsive charting. |
| **Axios** | Promise-based HTTP client for API requests. |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js** | Scalable javascript runtime environment. |
| **Express** (v5) | Minimalist web framework for API endpoints. |
| **MongoDB** | Highly flexible NoSQL database. |
| **Mongoose** | Elegant MongoDB object modeling for Node.js. |
| **JWT & Bcrypt** | Industry-standard authentication and password hashing. |

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user account | Public |
| `POST` | `/login` | Authenticate user and receive JWT token | Public |
| `GET` | `/` | Fetch all registered users | **Admin** |
| `PUT` | `/:id` | Update user role or account status | **Admin** |
| `DELETE`| `/:id` | Permanently delete a user account | **Admin** |

### 💰 Financial Records (`/api/records`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List records (supports search & pagination) | All |
| `POST` | `/` | Add a new financial record | **Admin** |
| `PUT` | `/:id` | Update/Edit an existing record | **Admin** |
| `DELETE`| `/:id` | Soft delete a record (Audit preserved) | **Admin** |

### 📈 Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/summary` | Retrieve aggregated dashboard summary data | All |

---

## 🚀 Setup Instructions

### 1. Backend Initialization
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=<YOUR_MONGODB_URI>
   JWT_SECRET=<YOUR_JWT_SECRET>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Initialization
1. Open a new terminal and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🧠 Technical Architecture & Trade-offs

*   **Vite over Next.js**: Chosen for its exceptional speed and developer experience as a Vite SPA (Single Page App). Keeps the frontend and backend strictly decoupled.
*   **MongoDB over SQL**: Chosen for the agile nature of financial record tracking, allowing the schema to evolve easily without complex SQL migrations.
*   **Stateless JWT Authentication**: Used over session cookies to enable easy horizontal scaling of the Node backend.
*   **Pipeline Aggregation**: Complex dashboard metrics are crunched via MongoDB pipelines directly on the server, significantly boosting client-side performance.
*   **Audit-Ready Soft Deletion**: Records are flagged (`isDeleted: true`) rather than eradicated, maintaining financial auditability.
