#Project SetUp
DANISH UMER - FA23-BSE-044
USMAN JAMIL - FA23-BSE-192
Link: https://haddi-fast-foods.vercel.app/

Hadi Fast Foods — Full Project Setup Guide

1. Project Overview
   Hadi Fast Foods is divided into three applications:

1) Server (Backend API)
   o Tech: Node.js, Express, MongoDB
   o Provides REST API on port 5000
   o Handles authentication using JWT
2) Admin (Admin Panel UI)
   o Tech: Next.js
   o Admin dashboard that consumes the backend API
3) Client (Customer Frontend)
   o Tech: Next.js
   o Customer-facing frontend that consumes the backend API

2. Prerequisites
   Install and confirm these are available on your machine:
    Node.js (LTS recommended)
    npm (or yarn/pnpm if you use them)
    MongoDB (local instance running on mongodb://localhost:27017)
    Git (optional, if you clone the repo)

3. Recommended Folder Structure
   Your repository should look similar to this:
   hadi-fast-foods/
   admin/
   server/
   client/
   Each part is installed and run independently.

4. Backend Setup (Server)
   4.1 Go to the server folder
   cd server
   4.2 Install dependencies
   npm install
   4.3 Create environment file
   Create a file named .env inside the server/ directory with the following values:
   MONGO_URI=&quot;mongodb://localhost:27017/haddifastfoods&quot;
   PORT=5000
   Meaning of variables
    MONGO_URI → MongoDB connection string (local DB: haddifastfoods)
    PORT → backend runs on http://localhost:5000
    JWT_SECRET → secret key for signing JWT tokens
    JWT_EXPIRES_IN → token expiry duration
   4.4 Start MongoDB
   Make sure MongoDB is running locally.
    If you installed MongoDB as a service, it may already be running.
    Otherwise run it using your OS method (MongoDB Compass or terminal).
   4.5 Run the backend
   npm run dev
   If there is no dev script, use:

npm start
Backend should now be available at:
http://localhost:5000

5. Admin Panel Setup (Admin)
   5.1 Go to the admin folder
   cd ../admin
   5.2 Install dependencies
   npm install
   5.3 Create environment file
   Create a file named .env.local inside the admin/ directory:
   NEXT*PUBLIC_API_URL=http://localhost:5000
   Meaning
    NEXT_PUBLIC_API_URL → backend base URL used by the admin UI
   Note: NEXT_PUBLIC* variables are exposed to the browser in Next.js, so only keep safe public config
   here.
   5.4 Run the admin app
   npm run dev
   Admin panel should now be available at:
   http://localhost:3000 (default Next.js port)
   If port 3000 is busy, Next.js will use the next available port (3001, 3002, etc.).

6. Client Frontend Setup (Client)
   6.1 Go to the client folder
   cd ../client
   6.2 Install dependencies
   npm install
   6.3 Environment configuration (Client)
   You mentioned the client is also Next.js, but didn’t specify its env file.
   In most setups it should also point to the same backend API.
   Create .env.local in client/ (recommended):
   NEXT_PUBLIC_API_URL=http://localhost:5000
   If your client uses a differently named variable in code (example: NEXT_PUBLIC_BASE_URL), use that
   instead. But if it matches admin usage, the above is ideal.

6.4 Run the client app
npm run dev
Client should now be available at:
http://localhost:3000 (or next available port)
If both Admin and Client run at the same time, one will shift to another port automatically.

7. Running Everything Together (Suggested Order)
   Open three terminals and run:
   Terminal 1 — Server
   cd server
   npm run dev
   Terminal 2 — Admin
   cd admin
   npm run dev
   Terminal 3 — Client
   cd client
   npm run dev

8. Quick Health Checklist
    MongoDB running?
   o mongodb://localhost:27017/haddifastfoods
    Server running?
   o http://localhost:5000
    Admin uses correct API url?
   o admin/.env.local has:
    NEXT_PUBLIC_API_URL=http://localhost:5000

 Client uses correct API url?
o client/.env.local has:
 NEXT_PUBLIC_API_URL=http://localhost:5000
