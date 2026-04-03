# Finance Data Processing & Access Control Backend

A backend system for managing financial records and users with role-based access
control, flexible querying, and dashboard-level analytics.

------------------------------------------------------------------------

## Overview

This project implements a backend system for a finance dashboard where
different users interact with financial data based on their roles.

The system is designed with a focus on clarity, maintainability, and
realistic backend behavior rather than unnecessary complexity.

Key capabilities include:

- Role-based access control (Viewer, Analyst, Admin)
- Financial record management with filtering, search, and pagination
- Dashboard APIs for aggregated insights
- Secure authentication with rate limiting
- Soft deletion and audit-friendly design


------------------------------------------------------------------------

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB (via Prisma ORM)
-   Redis (OTP handling)
-   Zod (validation)
-   JWT (authentication)

------------------------------------------------------------------------

## Project Structure

src/ ├── modules/ ├── middlewares/ ├── utils/ ├── config/ ├── prisma/

------------------------------------------------------------------------

## Authentication & Roles

Authentication is handled using JWT.

Roles: 
- Viewer → Read-only access to dashboard data\
- Analyst → Access to records and insights\
- Admin → Full access to users and records

------------------------------------------------------------------------

## Core Features

### Financial Records

Supports: 
- Create, update, delete (soft delete) 
- Filtering by type, category, and date range 
- Full-text search on category and notes 
- Pagination

Example: GET /records?type=EXPENSE&search=food&page=1&limit=5

------------------------------------------------------------------------

### Dashboard APIs

Provides aggregated insights:
- Total income and expenses\
- Net balance\
- Category-wise breakdown\
- Recent activity\
- Trends (weekly/monthly)

Example: GET /dashboard/trends?interval=weekly

------------------------------------------------------------------------

### User Management

Admins can:
- Create users
- Update roles and status
- Update user details

Users are not permanently deleted. Instead, status-based deactivation is used to preserve data integrity and maintain relationships with financial records.

Users can:
- Update their own email securely using OTP verification

------------------------------------------------------------------------

### Audit Logging

An audit log db model is included to track system-level actions such as record creation, updates, and user changes.

This is designed to support:
- Traceability of actions
- Debugging and system monitoring
- Future compliance requirements

Audit APIs are not exposed in this implementation, but the schema and structure are in place for extension in the future.

------------------------------------------------------------------------
## Seeding Script (For Testing)

A seeding script is provided to quickly populate the database with sample data.

Important notes:
- The script clears existing data before inserting new records
- It bypasses authentication and directly writes to the database
- It is intended strictly for testing and development purposes

Usage:
npx prisma db seed

It is recommended to run the seed script before testing the API to ensure consistent data.

------------------------------------------------------------------------
## Design Decisions

- Soft Delete:
  Records are not permanently deleted to preserve financial history and maintain auditability.

- User Deactivation Instead of Deletion:
  Users are not hard-deleted to preserve relationships with financial records and maintain system consistency.

- RBAC via Middleware:
  Authorization is enforced centrally using middleware to keep business logic clean and consistent.

- Separation of Concerns:
  Controllers handle request/response, services handle business logic, and validation is handled separately using Zod.

- Rate Limiting:
  Implemented at the application level to prevent abuse. In production, this would be complemented by infrastructure-level controls.

- Aggregation Logic:
  Dashboard APIs are separated from CRUD operations to clearly distinguish between transactional and analytical workloads.

------------------------------------------------------------------------

## API Testing

-   Swagger: http://localhost:8080/api-docs\
-   Postman collection included

------------------------------------------------------------------------

## Seeding Script

-   Clears DB before inserting data\
-   Bypasses auth (testing only)

Run: npx prisma db seed

------------------------------------------------------------------------

## Environment Variables

See example.env

------------------------------------------------------------------------

## Setup

npm install\
npm run dev

------------------------------------------------------------------------

## Future Improvements

## Future Improvements

- Distributed rate limiting using Redis\
- More granular permission system\
- Exposing audit logs via secure APIs\
- Advanced analytics and forecasting

------------------------------------------------------------------------

## Final Notes

Focused on building a clean, realistic backend with proper system
design.
