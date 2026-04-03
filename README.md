# Finance Data Processing & Access Control Backend

A backend system designed to handle financial data with structured access control, flexible querying, and meaningful aggregation.

---

## Why this exists

Most backend assignments end up as CRUD-heavy demos with a few filters on top. That wasn’t the goal here.

This project was built with a different intent:
- to simulate how a real financial backend behaves
- to enforce clear access boundaries between different types of users
- to treat data as something that needs to be preserved, not just modified

Instead of maximizing features, the focus was on getting the **fundamentals right**:
- who can access what (and why)
- how data is queried in realistic scenarios
- how aggregated insights are derived cleanly from transactional data

---

## What this system actually does

At a high level, this backend supports:

- Role-based access control (Viewer, Analyst, Admin)
- Financial record management with filtering, search, and pagination
- Dashboard APIs for aggregated insights (not just raw data dumping)
- Authentication with abuse protection (rate limiting)
- Soft deletion and audit-aware design (because financial data should not just disappear)

---

## Quick Start

If you just want to run the project locally:

---

### 1. Install dependencies

npm install

---

### 2. Configure environment variables

Create a `.env` file using `example.env` as reference.

---

### 3. Start required services

Make sure the following are running:

- MongoDB  
- Redis (required for OTP functionality)

#### Run Redis using Docker (recommended)

docker run -d -p 6379:6379 redis

---

### 4. Setup Prisma

Generate client:
npx prisma generate  

Sync schema:
npx prisma db push  

---

### 5. Start the server

npm run dev  

---

### 6. Seed the database (recommended)

npx prisma db seed  

This will:
- clear existing data  
- populate sample users and records  
- make API testing easier  

---

### 7. Test the API

Use the included Postman collection.

Base URL:
http://localhost:8080

---

### Notes

- Most endpoints require authentication  
- Login first to obtain a JWT token  
- Use `Authorization: Bearer <token>` for protected routes  
- Re-run seed if you want to reset data

---

## How to approach this repository

If you're reviewing this:

- Start with the **modules** (feature-based structure)
- Look at how **permissions are enforced at middleware level**
- Check how **dashboard logic is separated from CRUD logic**
- Notice how **filters + search + pagination are composed together**

This isn’t just about endpoints working, it’s about how the system is structured underneath.

---

## Architecture & Project Structure

One of the main goals while building this was to avoid the typical  
"everything ends up inside routes and controllers" mess that most small backends eventually turn into.

That approach works at first, but breaks the moment you add:
- permissions
- validation
- aggregation logic
- or anything slightly non-trivial

So instead of patching things later, the system was structured upfront around **clear separation of concerns and domain boundaries**.

---

### High-Level Structure

.
├── server.js
└── src
    ├── app.js
    ├── config
    ├── constants
    ├── middlewares
    ├── modules
    │   ├── auth
    │   ├── dashboard
    │   ├── finance
    │   └── user
    ├── prisma
    ├── routes
    │   └── index.js
    └── utils

---

### Entry Layer

- `server.js`  
  Starts the server and bootstraps the application

- `app.js`  
  Configures middleware, routes, and global error handling

This split might look small, but it keeps the app itself independent from how it's executed  
(which becomes useful the moment you introduce testing or different runtimes).

---

### Config Layer

Located in `src/config/`

- `db.js` → database connection  
- `redis.js` → Redis setup (used for OTP handling)  
- `env.js` → environment configuration  

All infrastructure-related setup lives here, so business logic never needs to care about *how* things are wired.

---

### Constants (Avoiding "magic strings" everywhere)

Located in `src/constants/`

- `roles.js`
- `permissions.js`

Instead of scattering role checks like `"ADMIN"` or `"ANALYST"` across the codebase, everything is centralized.

This makes:
- permission logic easier to audit  
- changes safer  
- and the system less error-prone over time  

---

### Middleware Layer (Where most of the real control happens)

Located in `src/middlewares/`

Handles cross-cutting concerns:

- `auth.middleware.js` → verifies JWT and attaches user context  
- `role.middleware.js` → enforces permissions  
- `validate.middleware.js` → request validation using Zod  
- `rateLimit.middleware.js` → protects endpoints from abuse  
- `error.middleware.js` → central error handling  

The idea is simple:

> if something applies to multiple routes, it should not live inside controllers

This keeps controllers clean and prevents repeating the same logic everywhere.

---

### Modules (Core of the system)

Located in `src/modules/`

Each module represents a **domain**, not just a group of endpoints.

Inside each module:
- controller → handles request/response flow  
- service → contains actual business logic  
- routes → defines endpoints  
- validation → defines input schemas  

Modules included:

- `auth` → authentication and login flows  
- `user` → user management and account operations  
- `finance` → financial records (core data layer)  
- `dashboard` → aggregated insights and analytics  

A very intentional decision here:

> dashboard logic is completely separate from finance logic

This avoids mixing:
- "store and update data" logic  
with  
- "analyze and aggregate data" logic  

(which is where a lot of backend designs start getting messy)

---

### Routing Layer

Located in `src/routes/index.js`

All module routes are composed and mounted here.

This gives a single, predictable entry point for the API instead of scattering route definitions across the project.

---

### Database Layer (Prisma + MongoDB)

Located in `src/prisma/`

- `schema.prisma` → defines data models  
- `client.js` → Prisma client instance  
- `seed.js` → seed script for testing  

Even though MongoDB is flexible, using Prisma enforces structure and consistency across the system.

---

### Utilities (Keeping modules focused)

Located in `src/utils/`

- `AppError.js` → structured error handling  
- `apiResponse.js` → consistent response format  
- `asyncHandler.js` → removes repetitive try/catch  
- `mailer.js` → email handling  
- `otp.js` → OTP generation  

These are intentionally kept outside modules so features don’t become tightly coupled.

---

### Why this structure?

Because backend code tends to rot when:

- logic is duplicated  
- permissions are scattered  
- controllers start doing too much  

This structure keeps things predictable:

- controllers stay thin  
- services handle logic  
- middleware handles cross-cutting concerns  
- modules stay domain-focused  

Not over-engineered, just structured enough to avoid future chaos.

---

## Authentication & Access Control

Authentication and authorization are treated as first-class concerns in this system, not something layered on top after everything else works.

The goal was to make access rules explicit, predictable, and easy to enforce across the entire API.

---

### Authentication (JWT-based)

Authentication is handled using JSON Web Tokens (JWT).

Once a user logs in:
- a token is issued
- the token is verified on every protected request
- user context (id, role) is attached to the request

This keeps the system stateless while still allowing strict access control.

---

### Why middleware-based authentication?

Authentication is enforced using middleware instead of being handled inside controllers.

This ensures:
- controllers don’t need to worry about identity
- every protected route behaves consistently
- missing or invalid tokens are handled centrally

In short:
> if a request reaches a controller, it is already authenticated

---

### Role System

The system defines three roles:

- Viewer  
  Can only access dashboard-level data (read-only)

- Analyst  
  Can work with financial records and access insights

- Admin  
  Full control over users and records

---

### Permission-Based Access (Not just roles)

Instead of directly checking roles everywhere, the system uses a permission layer.

Roles map to permissions, and permissions are enforced via middleware.

This avoids logic like:
```js
if (user.role === "ADMIN")
```
scattered across the codebase.

Instead:
- permissions are centralized
- routes declare what they require
- middleware enforces it

This makes the system easier to extend if roles evolve in the future.

---

### Why analysts are restricted (Intentional decision)

One interesting design choice here was around the Analyst role.

At first glance, it might seem logical to allow analysts to create records.
But that creates ambiguity in ownership and data consistency.

So the system leans towards a clearer separation:
-  Admins manage and control data
-  Analysts consume and analyze it

(This mirrors how many real-world systems separate data producers from data consumers)

---

### Authorization Flow

Every protected route follows this flow:
-  Authenticate user (JWT middleware)
-  Attach user context to request
-  Check permissions (role middleware)
-  Execute controller logic

This layered approach ensures:
-  consistent enforcement
-  minimal duplication 
-  predictable behavior across endpoints

---

### Why this approach?

Because access control tends to become messy when:
-  checks are scattered across controllers
-  roles are hardcoded everywhere
-  permissions are not clearly defined

This system avoids that by:
-  centralizing permissions
-  enforcing them through middleware
-  keeping business logic completely separate from access logic

The result is a system where:

access rules are easy to understand, and harder to break accidentally
---
## Financial Records (Core Data Layer)

This module handles the core transactional data of the system - income and expense records.

Instead of treating this as a basic CRUD layer, the focus here was to make the API flexible enough to support realistic usage patterns:
- filtering
- searching
- pagination
- and combinations of all three

---

### Data Model (What a record represents)

Each record includes:

- amount  
- type (INCOME / EXPENSE)  
- category  
- date  
- optional notes  

Additionally:
- records are linked to a creator (for traceability)
- soft delete is used instead of hard delete

(This ensures that financial history is preserved and can be audited later if needed)

---

### Why this is not "just CRUD"

A simple CRUD API would expose:
- create
- read
- update
- delete

But in real systems, data is rarely accessed like that.

You almost always need:
- filtered views
- search capability
- paginated results
- combinations of filters

So the records API is designed around **queryability**, not just storage.

---

### Filtering

Records can be filtered by:

- type → INCOME / EXPENSE  
- category → custom categories  
- date range → startDate and endDate  

Example:
GET /records?type=EXPENSE&category=Food&startDate=2026-03-01&endDate=2026-03-31

---

### Search

The API supports case-insensitive search across:

- category  
- notes  

Example:
GET /records?search=rent

(This allows quick lookups without needing exact matches or predefined categories)

---

### Pagination

Pagination is handled using:

- page  
- limit  

Example:
GET /records?page=2&limit=10

This prevents:
- large payloads
- unnecessary data transfer
- performance issues at scale

---

### Combining Filters (Important)

All query parameters are composable.

Example:
GET /records?type=EXPENSE&search=food&page=1&limit=5

This allows building complex queries without creating multiple endpoints.

(This is where the API starts feeling usable instead of rigid)

---

### Soft Delete (Important Design Choice)

Records are not permanently deleted.

Instead:
- `isDeleted` flag is set
- `deletedAt` timestamp is recorded

This ensures:
- data is not lost
- historical analysis remains possible
- accidental deletions are less destructive

For a financial system, this is almost always preferred over hard deletion.

---

### Ownership & Access

Records are linked to the user who created them.

Depending on role:
- access can be restricted or expanded
- ownership checks can be enforced where needed

(This keeps the system flexible for future changes in access rules)

---

### Why this design?

Because real-world data systems need to answer questions like:

- "show me all food expenses this month"
- "find entries related to rent"
- "give me recent transactions in pages"

A rigid CRUD-only API makes these hard.

A query-friendly API makes them natural.

That’s the difference this module is built around.

---

## Dashboard & Analytics (Derived Data Layer)

While the finance module handles raw transactional data, the dashboard module is responsible for turning that data into something useful.

This separation is intentional.

Instead of mixing aggregation logic into the records API, the system treats:
- data storage
- data analysis

as two distinct concerns.

---

### Why a separate dashboard module?

In many beginner-level systems, aggregation logic ends up inside the same layer as CRUD operations.

That approach works initially, but quickly becomes messy when:
- multiple types of summaries are needed
- performance considerations come into play
- query logic becomes complex

So here, the dashboard module is designed as a **read-optimized layer** built on top of the records data.

---

### What the dashboard provides

The API exposes several types of aggregated insights:

- Total income  
- Total expenses  
- Net balance  

- Category-wise breakdown  
- Recent activity  

- Trends over time (weekly / monthly)

Each of these answers a different kind of question:
- "How much did I earn/spend?"
- "Where is my money going?"
- "How is my spending changing over time?"

---

### Summary (High-Level Metrics)

Provides:

- totalIncome  
- totalExpense  
- netBalance  

This is the most basic layer of aggregation, but also the most frequently used.

Example:
GET /dashboard/summary

---

### Category Breakdown

Groups records by category and aggregates totals.

This helps answer:
- which categories dominate spending
- where income is coming from

The result is split by:
- INCOME
- EXPENSE

(This makes it easier to visualize or build charts on top of it)

---
### Recent Activity

Returns the most recent records based on date.

Supports:
- limiting number of records (for dashboards)
- quick overview of latest transactions

Example:
GET /dashboard/recent?limit=5

This is intentionally separate from the main records API to keep dashboard queries lightweight.

---

### Trends (Time-Based Aggregation)

One of the more interesting parts of the system.

Supports:
- monthly aggregation (default)
- weekly aggregation (ISO week-based)
- Custom Date aggregation

Example:
GET /dashboard/trends?interval=weekly

---

### Why trends matter

Raw data tells you what happened.  
Trends tell you how things are changing.

This is where the system moves from:
- storing data  
to  
- analyzing behavior

---

### Design Considerations

- Aggregation is done in the service layer, not in controllers  
- Queries are built on top of filtered records (reusable logic)  
- Time-based grouping is handled carefully (ISO week vs naive week splits)

(For example, weekly aggregation is not based on simple "divide by 7" logic, but proper calendar weeks)

---

### Why this design?

Because analytical queries evolve independently from transactional ones.

By separating the dashboard layer:
- new insights can be added without touching core data logic
- performance optimizations can be applied independently
- the system remains easier to extend

In short:
> records store data, dashboard explains it

---

## User Management & Account Flows

User management in this system is not treated as simple CRUD over a user table.

The goal here was to reflect how user systems behave in real applications:
- controlled access to user operations
- clear separation between admin actions and user actions
- secure handling of sensitive updates (like email changes)

---

### Admin-Controlled User Management

Admins are responsible for managing users in the system.

They can:

- create users  
- update roles  
- update status (ACTIVE / INACTIVE / SUSPENDED)  
- update basic user details  

---

### Why users are not deleted

Users are never permanently removed from the system.

Instead, their status is updated.

This ensures:
- financial records remain linked correctly  
- historical data is preserved  
- system integrity is maintained  

(Deleting a user in a financial system can break data relationships very quickly)

---

### Status System

Users have a status field:

- ACTIVE  
- INACTIVE  
- SUSPENDED  

This allows:
- controlled access without deleting data  
- temporary restriction of accounts  
- safer lifecycle management of users  

---

### Separation of Admin vs User Actions

A key design decision was separating:

- admin-controlled operations (user management)
- user-controlled operations (account actions)

This avoids situations where:
- admins perform sensitive actions on behalf of users  
- or users bypass system constraints  

---

### Account-Level Routes (Self-Service)

Separate routes are provided for user-specific actions (e.g. account updates).

This allows users to:
- interact with their own account  
- perform actions that should not be exposed via admin endpoints  

---

### Email Update Flow (OTP-Based Verification)

Changing a user's email is treated as a sensitive operation.

Instead of allowing direct updates, the system uses a two-step OTP flow.

---

#### Step 1 - Request Email Change

The user provides a new email.

The system:
- checks if the email is already in use  
- generates an OTP  
- stores it temporarily (via Redis)  
- sends the OTP to the new email  

---

#### Step 2 - Verify OTP

The user submits:
- new email  
- OTP  

The system:
- verifies the OTP  
- updates the email  
- clears the stored OTP  

---

### Why this flow?

Because email is a critical identity field.

Allowing direct updates would:
- make account takeover easier  
- bypass ownership verification  

This approach ensures:
> the user actually owns the new email before it becomes part of their account

---

### Why admin does NOT handle OTP

Admins can manage users, but they do not handle OTP-based verification.

This avoids:
- exposing sensitive flows to admin control  
- creating trust issues in account ownership  

In this system:
> identity verification always belongs to the user

---

### Design Considerations

- OTP is stored temporarily (not persisted in DB)  
- Redis is used for expiry-based storage  
- flows are split into request + verify steps  
- sensitive operations are never single-step  

---

### Why this design?

Because user systems tend to fail in subtle ways:

- mixing admin and user responsibilities  
- allowing direct updates to sensitive fields  
- not verifying ownership  

This implementation avoids those pitfalls by:

- separating concerns clearly  
- enforcing verification where required  
- keeping flows explicit and controlled  

It’s not overly complex - just structured enough to avoid common mistakes.

## API Testing

The API is designed to be explored through real usage, not just static endpoints.

### Postman

A Postman collection is included in the repository.

---

### Setup

1. Import the collection  
2. Set base URL:
   http://localhost:8080  

3. Login using seeded credentials  
4. Copy the token and add:
   Authorization: Bearer <token>

---

### Suggested Flow

To understand the system properly:

1. Start with authentication  
2. Explore records:
   - filtering
   - search
   - pagination  
3. Move to dashboard:
   - summary
   - category breakdown
   - trends  

The APIs are intentionally composable, combining query parameters reveals most of the system’s behavior.

---

### Test Credentials (from seed)

Email: admin@example.com  
Password: password123

---

### Suggested Testing Flow

If you're exploring the system for the first time:

1. Run the seed script (explained below)  
2. Login using seeded credentials  
3. Test:
   - records (filters + search + pagination)  
   - dashboard (summary + trends)  
   - user flows (if needed)  

The APIs are designed to be composable, so combining query params is where most of the behavior becomes visible.

## Future Improvements

Some areas that can be extended further:

- Distributed rate limiting using Redis  
- More granular permission system  
- Exposing audit logs via secure APIs  
- Advanced analytics and forecasting  

The current system is structured in a way that these can be added without major refactoring.

## Final Notes

This project was built with a simple goal:

not to implement everything,  
but to implement the *right things properly*.

A lot of backend systems work, 
until they need to evolve.

The focus here was to build something that:
- stays understandable as it grows  
- keeps responsibilities clear  
- and avoids the usual "patch it later" problems  

If you're reviewing this, the most interesting parts are not the endpoints themselves, but:
- how access control is enforced  
- how query logic is composed  
- how aggregation is kept separate from data storage  

That’s where most backend systems either stay clean, or slowly fall apart.