# 🍔 Haddi Fast Foods -- Full Stack Project
# Members
### FA23-BSE-044 (Danish Umer Saleem)
### FA23-BSE-192 (Usman Jamil)

Haddi Fast Foods is a **full‑stack food ordering application** built
with **Node.js, Express, MongoDB, and Next.js**.\
It includes a **customer website**, an **admin dashboard**, and a **server**.



------------------------------------------------------------------------

Since the admin panel only supports login and not registration, you will need to create users manually in the database. To do this, you can use the registration API route that exists in your backend. Open Postman and make a POST request to:<br />

http://localhost:5000/api/auth/register<br />


In the body of the request, choose raw → JSON and provide the following fields:<br />

{
  "name": "Your User Name",
  "email": "user@example.com",
  "password": "yourpassword"
}<br />


Send the request, and the user will be created in the database. After that, you can use the admin panel login with the created email and password.<br />
------------------------------------------------------------------------<br />

## 🧩 Project Parts

-   **server** → Node.js + Express + MongoDB (runs on port 5000)\
-   **client** → Next.js (User website)\
-   **admin** → Next.js (Admin panel)

------------------------------------------------------------------------

## 📦 Requirements

Make sure you have installed:

-   **Node.js** (v18 or above recommended)\
-   **MongoDB** (running locally)\

Check:

    node -v
    npm -v
    mongo --version

------------------------------------------------------------------------

## 📁 Project Structure

    project-root/
     ├── server
     ├── client
     └── admin

------------------------------------------------------------------------

## ⚙️ Server Setup (Backend)

``` bash
cd server
npm install
```

Create a **.env** file inside the `server` folder and paste the
following:

    on whatsapp

Run server:

``` bash
npm run dev
```

Server will start on: 👉 http://localhost:5000

------------------------------------------------------------------------

## ✉️ Email Service (Brevo)

This project uses **Brevo (formerly Sendinblue)** as the email service
provider.

Brevo is used to send: - Account-related emails\
- Notifications\
- Verification or system emails

Brevo provides reliable  services that easily integrate with
**NodeMailer** for sending emails from Node.js applications.

------------------------------------------------------------------------

## 🌐 Client Setup (User Website)

Open a new terminal:

``` bash
cd client
npm install
npm run dev
```

Client runs on: 👉 http://localhost:3000

Live version: 👉 https://haddi-fast-foods.vercel.app/

------------------------------------------------------------------------

## 🛠️ Admin Panel Setup

Open another terminal:

``` bash
cd admin
npm install
npm run dev
```

Admin panel runs on: 👉 http://localhost:3001 (or next available port)

------------------------------------------------------------------------

## ✅ Final Result (Local)

-   Server: http://localhost:5000\
-   Client: http://localhost:3000\
-   Admin: http://localhost:3001

Make sure **MongoDB is running** before starting the server.

------------------------------------------------------------------------

## 🧪 Common Commands

Install packages:

``` bash
npm install
```

Run project:

``` bash
npm run dev
```