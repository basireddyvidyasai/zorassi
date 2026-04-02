# Finance Dashboard API Documentation

## Auth Endpoints

### Register User
`POST /api/auth/register`
- Body: `{ name, email, password, role }`
- Roles: `Viewer`, `Analyst`, `Admin`

### Login User
`POST /api/auth/login`
- Body: `{ email, password }`
- Returns: `{ _id, name, email, role, token }`

### Get All Users (Admin Only)
`GET /api/auth`
- Header: `Authorization: Bearer <token>`

### Update User (Admin Only)
`PUT /api/auth/:id`
- Body: `{ role, status }`

## Records Endpoints

### Create Record (Admin Only)
`POST /api/records`
- Header: `Authorization: Bearer <token>`
- Body: `{ amount, type, category, date, notes }`

### Get Records (Analyst/Admin)
`GET /api/records`
- Query Params: 
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (searches notes)
  - `type` (income/expense)
  - `category`
- Returns: `{ records, total, page, pages }`

### Update Record (Admin Only)
`PUT /api/records/:id`

### Soft Delete Record (Admin Only)
`DELETE /api/records/:id`
- Sets `isDeleted: true`

## Dashboard Endpoints

### Get Summary
`GET /api/dashboard/summary`
- Returns: `totalIncome`, `totalExpenses`, `netBalance`, `categoryTotals`, `recentActivity`, `monthlyTrends`
