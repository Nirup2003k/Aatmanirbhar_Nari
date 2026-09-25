# Aatmanirbhar Nari – Home Business Enablement Portal

A web-based platform designed to empower women entrepreneurs running home-based businesses by enabling them to showcase their offerings, manage operational schedules, and process service inquiries and orders. It simultaneously provides customers with a centralized directory to discover local micro-enterprises, submit inquiries, place service orders, and track order fulfillment in real time.

---

## 📋 Project Overview

The **Aatmanirbhar Nari** portal bridges the digital gap between women home entrepreneurs and local customers. Micro-entrepreneurs often face challenges in digital visibility, customer reach, and structured business operations. This platform addresses those challenges through role-specific interfaces:

- **For Customers**: Enables seamless discovery of verified home-based micro-enterprises across categories (e.g., Tiffin Services, Handicrafts, Tailoring, Food & Catering), direct service inquiry submission, shopping cart checkout, and live order tracking.
- **For Entrepreneurs**: Provides dedicated tools to create business profiles, manage service catalogs and pricing, set weekly availability schedules, respond to customer inquiries, process customer orders through defined lifecycles, and submit business verification requests.
- **For Admins**: Offers centralized platform management including system statistics, user oversight, business verification approval/rejection workflows, and platform-wide order and inquiry monitoring.

---

## 👥 Core Roles

| Role | Key Capabilities & Responsibilities |
| :--- | :--- |
| **CUSTOMER** | • Register and authenticate customer accounts<br>• Discover and search businesses with filtering by category, location, and availability<br>• View detailed business profiles, owner details, operating hours, and service listings<br>• Send direct service inquiries to business owners<br>• Manage an in-memory shopping cart and place orders with delivery details<br>• Track order status history and cancel orders while `PENDING` or `ACCEPTED` |
| **ENTREPRENEUR** | • Create and edit home business profiles<br>• Submit and resubmit business verification documentation/details for admin review<br>• Create and update service catalog items (name, description, price, availability tag)<br>• Configure 7-day operating schedule (availability toggles and daily working hours)<br>• Review and respond to customer service inquiries (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`)<br>• Process incoming orders and update order states through sequential lifecycle stages |
| **ADMIN** | • View system-wide analytical metrics (users, businesses, orders, inquiries)<br>• Inspect platform users with role-based filtering (`CUSTOMER`, `ENTREPRENEUR`, `ADMIN`)<br>• Overview all registered businesses and their detailed profile data<br>• Review pending business verification requests and approve or reject with reason feedback<br>• Oversee all platform-wide customer orders and inquiries |

---

## ✨ Main Features

- **Authentication & Authorization**: User registration and login supporting `CUSTOMER` and `ENTREPRENEUR` roles with password validation, Argon2 hashing, and JWT tokens stored in HttpOnly cookies.
- **Business Discovery & Multi-Param Filtering**: Search bar and filter controls enabling case-insensitive search across business names, categories, descriptions, and services, paired with location and availability filters.
- **Detailed Business Profile**: Public-facing profile page displaying owner information, experience level, location, service area, pricing tier, weekly operating schedule, service menu, and inquiry form.
- **Service Inquiry System**: Form-based direct inquiry tool linked to specific services and businesses, allowing customers to ask questions before ordering.
- **Shopping Cart & Checkout**: Interactive shopping cart managing service items per business, quantity adjustments, itemized subtotal computation, delivery address entry, and order creation.
- **Order Management & Tracking**: Customer dashboard for tracking order progress, viewing itemized receipts, and cancelling orders in eligible states (`PENDING` or `ACCEPTED`).
- **Entrepreneur Business Management**: Profile editor for business details, location, experience level, and service areas.
- **Services & Weekly Availability Manager**: Tools for entrepreneurs to add/edit service catalog items and define operating hours across all 7 days of the week.
- **Inquiry Processing Workflow**: Inquiry inbox allowing entrepreneurs to accept, reject, or mark inquiries as completed.
- **Order Processing Workflow**: Enforced state transition model for entrepreneurs to move orders through preparation and fulfillment stages.
- **Business Verification Workflow**: Two-step verification process where entrepreneurs submit verification details and administrators review and mark them as `APPROVED` or `REJECTED`.
- **Admin Management Dashboard**: Dedicated dashboard containing platform overview statistics, user lists, business listings, verification decision tools, and order/inquiry logs.
- **Role-Based Protected Navigation**: Route guards (`ProtectedRoute`) and context-driven header/navigation menus tailored to unauthenticated visitors, customers, entrepreneurs, and admins.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** – UI library for declarative component structure
- **Vite 8** – Modern build tool and fast local development server
- **Tailwind CSS 4** – Utility-first CSS framework for custom responsive styling
- **React Router DOM 7** – Client-side routing and page navigation
- **Lucide React** – Clean SVG icon set

### Backend
- **Node.js** – JavaScript backend runtime environment
- **Express 4** – Web application framework for REST API endpoints
- **PostgreSQL** – Relational SQL database engine
- **Prisma ORM 6** – Next-generation ORM for type-safe database queries and migrations
- **Argon2** – Password hashing algorithm (`argon2`)
- **JSON Web Token** – Secure token generation (`jsonwebtoken`)
- **Cookie Parser** – Middleware for HTTP cookie extraction (`cookie-parser`)
- **CORS** – Cross-Origin Resource Sharing configuration (`cors`)
- **Dotenv** – Environment variable loader (`dotenv`)

### Tooling & Quality
- **Oxlint** – Fast JavaScript/React linter for static code analysis
- **Nodemon** – Backend live-reloading utility for development

---

## 📁 Project Structure

```text
Aatmanirbhar_Nari/
├── backend/
│   ├── prisma/
│   │   ├── migrations/             # Database migration history files
│   │   ├── schema.prisma           # Prisma data models & enums
│   │   └── seed.js                 # Seed script for initial business data
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Prisma client singleton configuration
│   │   ├── controllers/            # Controller logic (auth, business, order, etc.)
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── businessController.js
│   │   │   ├── entrepreneurController.js
│   │   │   ├── inquiryController.js
│   │   │   └── orderController.js
│   │   ├── middleware/             # Authentication & error handling middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── routes/                 # Express API route declarations
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── businessRoutes.js
│   │   │   ├── entrepreneurRoutes.js
│   │   │   ├── inquiryRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── app.js                  # Express app setup, CORS & routes mounting
│   │   └── server.js               # HTTP server entry point
│   ├── .env.example                # Backend environment variable template
│   ├── README.md                   # Backend specific documentation
│   └── package.json                # Backend dependencies & scripts
├── src/                            # Frontend source code
│   ├── components/                 # UI components (business, cart, navbar, footer, common)
│   ├── constants/                  # Category maps and static data
│   ├── context/                    # React Context (AuthContext, CartContext)
│   ├── data/                       # Static learning materials
│   ├── hooks/                      # Custom React hooks
│   ├── pages/                      # Application pages (Home, Businesses, Admin, Orders, etc.)
│   │   ├── About/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── BusinessDetails/
│   │   ├── Businesses/
│   │   ├── Entrepreneur/
│   │   ├── Home/
│   │   ├── Learning/
│   │   └── Orders/
│   ├── services/                   # API client layer (api.js)
│   ├── App.jsx                     # Root application routing configuration
│   ├── index.css                   # Tailwind imports and base styles
│   └── main.jsx                    # React app entry point
├── .env.example                    # Frontend environment variable template
├── package.json                    # Frontend dependencies & scripts
├── vite.config.js                  # Vite configuration
└── README.md                       # Project root documentation
```

---

## ⚙️ Local Setup Guide

Follow these steps to run the application locally on Windows:

### Prerequisites
- **Node.js**: `v20+` (or `v24.x`)
- **npm**: `v10+`
- **PostgreSQL**: `v16+` or `v18+` running locally on port `5432`

---

### Step 1: Clone Repository
```cmd
git clone <repository-url>
cd Aatmanirbhar_Nari
```

---

### Step 2: Install Frontend Dependencies
From the project root directory:
```cmd
npm install
```

---

### Step 3: Install Backend Dependencies
Navigate to the `backend` folder and install dependencies:
```cmd
cd backend
npm install
```

---

### Step 4: Configure Backend Environment
In the `backend` directory, create a `.env` file from `.env.example`:
```cmd
copy .env.example .env
```
Update the `.env` file with your local PostgreSQL password and secret keys (do not use real production secrets):
```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/aatmanirbhar_nari"
JWT_SECRET="your-secure-random-jwt-secret"
FRONTEND_URL="http://localhost:5173"
```

---

### Step 5: Configure Frontend Environment
Navigate back to the root directory and create `.env.local` from `.env.example`:
```cmd
cd ..
copy .env.example .env.local
```
Ensure `.env.local` contains:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 6: Set Up PostgreSQL Database
Open PostgreSQL (via `psql` or pgAdmin) and create the target database if it doesn't exist:
```sql
CREATE DATABASE aatmanirbhar_nari;
```

---

### Step 7: Run Database Migrations and Seeding
From the `backend` directory, execute Prisma migration and seed scripts:
```cmd
cd backend
npm run prisma:migrate
npm run prisma:seed
```
This initializes database tables and seeds fictional sample business profiles and services.

---

### Step 8: Start Backend Development Server
From the `backend` directory:
```cmd
npm run dev
```
The backend API server will start at `http://localhost:5000`.

---

### Step 9: Start Frontend Development Server
Open a new terminal window, navigate to the project root directory, and start Vite:
```cmd
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Safe Example |
| :--- | :--- | :--- |
| `PORT` | Port number for the Express server | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:yourpassword@localhost:5432/aatmanirbhar_nari` |
| `JWT_SECRET` | Secret key for signing authentication JWT tokens | `development-jwt-secret-key-32chars` |
| `FRONTEND_URL` | Frontend origin permitted for CORS requests | `http://localhost:5173` |

### Frontend (`.env.local`)
| Variable | Description | Safe Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base endpoint URL for REST API requests | `http://localhost:5000/api` |

> ⚠️ **Security Notice**: Real database credentials, production secrets, and JWT keys must be kept inside local `.env` and `.env.local` files and should **never** be committed to source control repository repositories.

---

## 🚀 Production Deployment

To safely deploy **Aatmanirbhar Nari** to production hosting (e.g., Render, Railway, Vercel, Netlify):

1. **Frontend API URL Configuration**: Set `VITE_API_BASE_URL` (e.g., `https://api.yourdomain.com/api`) in your frontend environment during the build step (`npm run build`).
2. **Backend Allowed Origin**: Set `FRONTEND_URL` on the backend server environment (e.g., `https://yourdomain.com`) to enforce restricted CORS access.
3. **Strong Production Secrets**: Configure a cryptographically strong, random string for `JWT_SECRET` (minimum 32 characters) and set your production PostgreSQL string for `DATABASE_URL`.
4. **Environment & Cookie Security**: Set `NODE_ENV=production`. Use `COOKIE_SAMESITE=lax` when frontend and backend share a root domain or subdomain. Set `COOKIE_SAMESITE=none` only when hosting on distinct cross-site domains over HTTPS.
5. **Production Database Migrations**: Run `npx prisma migrate deploy` (or `npm run prisma:deploy` from `backend/`) during deployment pipelines to apply schema updates non-destructively. Do **not** run `prisma migrate dev` in production.
6. **SPA Route Rewrite**: When deploying the built static frontend (`dist/`), ensure your host rewrites unknown requests to `/index.html` (e.g., via `public/_redirects`).
7. **Secrets Hygiene**: Never commit `.env` files, production tokens, or real database credentials to Git repositories.

---

## 🔄 Order Lifecycle

The platform enforces a strict, deterministic order state machine managed by backend authorization logic.

```text
               [ Customer Creates Order ]
                           │
                           ▼
                      ( PENDING ) ─────────────┐
                           │                   │
           (Entrepreneur   │   (Entrepreneur   │ (Customer / Entrepreneur
             Accepts)      │     Rejects)      │   Cancels)
                           ▼                   │
                      ( ACCEPTED ) ────────────┼──────────► [ CANCELLED ]
                           │                   │
                           ▼                   │
                      ( PREPARING )            │
                           │                   │
                           ▼                   │
                       ( READY )               │
                           │                   │
                           ▼                   ▼
                      ( COMPLETED )      [ REJECTED ]
```

### Valid Order Statuses & Descriptions
- `PENDING`: Order placed by customer; awaiting entrepreneur review.
- `ACCEPTED`: Order accepted by entrepreneur for processing.
- `PREPARING`: Order in active preparation/production.
- `READY`: Order finished and prepared for pickup or delivery.
- `COMPLETED`: Order successfully delivered and completed.
- `REJECTED`: Order declined by entrepreneur during pending status.
- `CANCELLED`: Order cancelled by customer or entrepreneur before processing began.

### Enforced State Transitions
- **Standard Fulfillment**: `PENDING` → `ACCEPTED` → `PREPARING` → `READY` → `COMPLETED`
- **Entrepreneur Rejection**: `PENDING` → `REJECTED`
- **Cancellation**: `PENDING` → `CANCELLED` or `ACCEPTED` → `CANCELLED`

*Note: Terminal states (`COMPLETED`, `REJECTED`, `CANCELLED`) cannot be transitioned further.*

---

## 🛡️ Business Verification Workflow

To maintain platform trust, business entries undergo an administrative verification review:

1. **Submission (`PENDING`)**: When an entrepreneur submits or resubmits business details (`verificationDetails`), the business status is automatically set to `PENDING`, resetting previous rejection notes.
2. **Admin Evaluation**: Admins inspect pending verification requests from the Admin Dashboard.
3. **Decision Outcome**:
   - **`APPROVED`**: Admin approves the profile. The system timestamps `verifiedAt` and attaches `verifiedById`.
   - **`REJECTED`**: Admin rejects the profile and provides a required `verificationReason`. The entrepreneur can inspect the feedback and resubmit.

> **Disclaimer**: Verification on this platform represents an internal administrative review of business profile descriptions and owner details. It does not constitute legal certification, government accreditation, or physical authenticity verification.

---

## 🔒 Security Implementation

- **Role-Based Authorization**: Restricts access to sensitive routes using Express middleware (`authorizeRoles`) and React Router guards (`ProtectedRoute`).
- **Resource Ownership Verification**: Verification checks (`verifyOwnership`) ensure entrepreneurs can only edit their own businesses, services, and orders.
- **HttpOnly Cookie Authentication**: JWT tokens are issued inside HttpOnly, `SameSite=Lax` cookies (`auth_token`) to mitigate risks of token extraction via Cross-Site Scripting (XSS).
- **Argon2 Password Hashing**: Passwords are hashed with `argon2` during registration and verified during login, preventing plain-text password exposure.
- **Server-Side Price Calculation**: Order monetary totals are calculated directly on the server by looking up current database prices, preventing client-side price tampering.
- **Strict Environment Checks**: Server throws explicit errors if required configuration keys (`JWT_SECRET`) are missing at launch.
- **Restricted CORS Setup**: Express CORS options restrict requests exclusively to configured origins (`http://localhost:5173`, `http://127.0.0.1:5173`, `FRONTEND_URL`) with credentials allowed.
- **Payload Size Limits**: JSON request body size is capped at `100kb` to guard against large payload Denial-of-Service (DoS) attacks.
- **Centralized Safe Error Handling**: Unhandled internal server errors (HTTP 500+) log details on the server while returning generic `Internal Server Error` responses to clients to prevent stack trace leaks.

---

## 🧪 Testing & Verification

The project code has been verified using the following established checks:

- **Static Code Analysis**: Executed `oxlint` (`npm run lint`) across the frontend codebase to verify code quality and fix formatting issues.
- **Production Build Compilation**: Executed Vite production build (`npm run build`) to ensure build pipeline integrity without syntax errors.
- **Manual API & Flow Verification**: Validated authentication endpoints, role authorization bounds, order state transition rules, and database CRUD operations.

---

## ⚠️ Current Limitations

- **Single Business Focus in Entrepreneur UI**: While the database schema supports multiple business records per user, the current frontend dashboard UI is optimized around managing one business profile per entrepreneur account.
- **Static Learning Content**: Learning Hub articles are rendered from client-side static data objects rather than a dynamic CMS or database backend.
- **Client-Side In-Memory Cart**: The customer shopping cart state is stored in React context and resets when the browser session is closed or reloaded.
- **Disabled Public Admin Registration**: Direct registration of `ADMIN` role accounts via the API endpoint is explicitly prohibited for security; admin accounts must be seeded or assigned via database administration tools.

---

## 💡 Demo Walkthrough

### 1. Customer Demo Flow
1. **Register/Login**: Navigate to `/auth/register` and select **Customer Account**.
2. **Explore Businesses**: Go to `/businesses` and filter by category (e.g., *Tiffin Services*) or search by keyword (e.g., *Hubli*).
3. **View Profile**: Click a business card to view full profile details, weekly schedule, and available services.
4. **Submit Inquiry / Add to Cart**: Send a message via the inquiry form or add desired services to the cart.
5. **Checkout**: Click cart icon, enter delivery address, and place order.
6. **Track / Cancel**: Navigate to `/orders` to monitor live order status (`PENDING`, `ACCEPTED`, etc.) or cancel if still pending.

### 2. Entrepreneur Demo Flow
1. **Register/Login**: Navigate to `/auth/register` and select **Entrepreneur Account**.
2. **Dashboard**: Navigate to `/entrepreneur/dashboard`.
3. **Business & Verification**: Fill in business profile information and submit verification details.
4. **Services & Schedule**: Add service catalog items with pricing, and configure 7-day operating hours.
5. **Inquiries**: Check incoming inquiries and update status (`ACCEPTED`, `COMPLETED`).
6. **Order Processing**: View customer orders and transition statuses sequentially (`PENDING` → `ACCEPTED` → `PREPARING` → `READY` → `COMPLETED`).

### 3. Admin Demo Flow
1. **Login**: Log in using pre-configured `ADMIN` credentials.
2. **Dashboard**: Navigate to `/admin/dashboard` to view overall metrics (users, businesses, orders, inquiries).
3. **User & Business Management**: Filter users by role and view business registry.
4. **Business Verification**: Open the **Verifications** tab, review business submissions, and click **Approve** or **Reject** (with required reason).
5. **Order & Inquiry Oversight**: Monitor system-wide order logs and customer inquiries.

---

## 📜 License

No license is currently specified for this repository.
