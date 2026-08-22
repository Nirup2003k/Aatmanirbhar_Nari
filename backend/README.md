# Aatmanirbhar Nari Backend API

Backend REST API for the Aatmanirbhar Nari platform built with Node.js, Express, Prisma ORM, and PostgreSQL.

---

## 🛠️ Prerequisites

- **Node.js**: `v24.19.0` or higher
- **npm**: `v10+`
- **PostgreSQL**: `v18.6` running on `localhost:5432`
- **Database Name**: `aatmanirbhar_nari`

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

From the `backend` directory, run:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file inside the `backend` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and set your PostgreSQL password:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/aatmanirbhar_nari"
```

### 3. Run Prisma Migration

Create and apply database migrations to set up the `Business`, `Service`, and `BusinessAvailability` tables:

```bash
npx prisma migrate dev --name initial_business_schema
```

### 4. Seed Database

Populate PostgreSQL with initial fictional business data:

```bash
npm run prisma:seed
```

### 5. Start Development Server

Run the server with live reloading:

```bash
npm run dev
```

The API server will run at `http://localhost:5000`.

---

## 📡 API Endpoints

### 1. Health Check
- **`GET /api/health`**
- Response:
```json
{
  "success": true,
  "message": "Aatmanirbhar Nari API is running"
}
```

### 2. Get All Businesses (with Filtering & Search)
- **`GET /api/businesses`**
- **Query Parameters**:
  - `search` (case-insensitive search across business name, category, description, services)
  - `location` (case-insensitive location filter)
  - `category` (case-insensitive category filter)
  - `availability` (optional boolean/availability filter)

**Examples**:
- `GET http://localhost:5000/api/businesses?search=tiffin`
- `GET http://localhost:5000/api/businesses?location=hubli`
- `GET http://localhost:5000/api/businesses?category=Tiffin%20Services`
- `GET http://localhost:5000/api/businesses?search=tiffin&location=hubli` (AND logic)

### 3. Get Single Business Details
- **`GET /api/businesses/:id`**
- **Examples**:
  - `GET http://localhost:5000/api/businesses/1`
  - Returns business information along with linked services and weekly operating availability.
  - Returns `404` with `{ "success": false, "message": "Business not found" }` if invalid or non-existent ID.
