# 🏫 School Management API

A RESTful Node.js API built with **Express.js** and **MySQL** that lets you add schools and retrieve them sorted by proximity to any location using the Haversine formula.

---

## 📁 Project Structure

```
school-management-api/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection pool + DB initializer
│   ├── controllers/
│   │   └── schoolController.js  # Business logic (addSchool, listSchools)
│   ├── middleware/
│   │   └── validation.js        # express-validator rules
│   ├── routes/
│   │   └── schoolRoutes.js      # Route definitions
│   └── server.js                # App entry point
├── docs/
│   ├── schema.sql                            # Database schema + seed data
│   └── School_Management_API.postman_collection.json
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Setup

### Prerequisites
- Node.js v18+
- MySQL 8+

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

**.env fields:**
| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | _(empty)_ | MySQL password |
| `DB_NAME` | `school_management` | Database name |

### 3. Create the database
```bash
mysql -u root -p < docs/schema.sql
```
This creates the database, the `schools` table, indexes, and optional seed data.

### 4. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3000
```

---

### `POST /addSchool`

Adds a new school to the database.

**Request body** (`application/json`):
```json
{
  "name":      "Springfield High School",
  "address":   "742 Evergreen Terrace, Springfield, IL 62701",
  "latitude":  39.7817,
  "longitude": -89.6501
}
```

| Field | Type | Constraints |
|---|---|---|
| `name` | string | Required, 2–255 chars |
| `address` | string | Required, 5–500 chars |
| `latitude` | float | Required, -90 to 90 |
| `longitude` | float | Required, -180 to 180 |

**201 Created:**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Springfield High School",
    "address": "742 Evergreen Terrace, Springfield, IL 62701",
    "latitude": 39.7817,
    "longitude": -89.6501,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**400 Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "latitude", "message": "Latitude must be a number between -90 and 90" }
  ]
}
```

---

### `GET /listSchools`

Fetches all schools sorted by proximity to the given coordinates.

**Query parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `latitude` | float | ✅ | User's latitude (-90 to 90) |
| `longitude` | float | ✅ | User's longitude (-180 to 180) |

**Example:**
```
GET /listSchools?latitude=40.7128&longitude=-74.0060
```

**200 OK:**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "user_location": { "latitude": 40.7128, "longitude": -74.006 },
  "total": 2,
  "data": [
    {
      "id": 1,
      "name": "Greenwood High School",
      "address": "123 Oak Avenue, New York, NY 10001",
      "latitude": 40.7128,
      "longitude": -74.006,
      "distance_km": 0.0
    },
    {
      "id": 2,
      "name": "Springfield High School",
      "address": "742 Evergreen Terrace, Springfield, IL 62701",
      "latitude": 39.7817,
      "longitude": -89.6501,
      "distance_km": 1370.44
    }
  ]
}
```

---

## 📐 Distance Calculation

Schools are sorted using the **Haversine formula**, which accurately measures great-circle distances on Earth's surface — essential for geographic proximity calculations.

```
d = 2R · arcsin(√(sin²(Δlat/2) + cos(lat₁)·cos(lat₂)·sin²(Δlon/2)))
```

where **R = 6,371 km** (Earth's mean radius).

---

## 🧪 Testing with Postman

1. Open Postman → **Import** → select `docs/School_Management_API.postman_collection.json`
2. Set the `baseUrl` collection variable to your server URL
3. Run requests in this order:
   - **Health Check** — confirm server is alive
   - **Add School (Success)** — insert a school
   - **List Schools (Near New York)** — verify proximity sort

---

## 🚀 Deployment

### Railway / Render / Fly.io
1. Push your repo to GitHub
2. Connect the repo in your hosting dashboard
3. Set environment variables matching `.env.example`
4. Deploy — the server starts with `npm start`

### Environment variables to set in production
```
NODE_ENV=production
PORT=3000
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_NAME=school_management
```

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP framework |
| `mysql2` | MySQL driver with promise support |
| `express-validator` | Input validation & sanitization |
| `dotenv` | Environment variable loading |
| `cors` | Cross-Origin Resource Sharing |
