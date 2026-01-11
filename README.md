# Haddi Fast Foods - Full Stack Project

## Team
- FA23-BSE-044 - Danish Umer Saleem
- FA23-BSE-192 - Usman Jamil

Haddi Fast Foods is a full-stack food ordering platform composed of a Node.js/Express API, a MongoDB database, a customer-facing Next.js application, and a separate Next.js admin dashboard. Customers can browse products, place orders, and receive email notifications, while administrators manage menu items and track orders through the dashboard.

---

## Repository Layout
```
FoodOrderingWeb/
+-- admin/   # Next.js admin dashboard
+-- client/  # Next.js customer website
+-- server/  # Express API + MongoDB models + Brevo email service
+-- README.md
```

---

## Requirements
- Node.js 18 or later (npm included)
- MongoDB Community Server running locally (or a reachable Atlas cluster)
- Git (for collaboration and deployment)

Verify the tooling:
```
node -v
npm -v
mongo --version
git --version
```

---

## Installation
Install dependencies in each workspace:
```bash
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

### Server environment variables
Create `server/.env` and supply values that match your setup:
```
Port=5000
MONGO_URI=mongodb://127.0.0.1:27017/haddi-fast-foods
JWT_SECRET=replace-with-a-long-random-string
SMTP_USER=your-brevo-smtp-username
SMTP_PASS=your-brevo-smtp-password
SENDER_EMAIL="Haddi Fast Foods <no-reply@yourdomain.com>"
```
> Never commit `.env` files. Maintain separate files per environment (local, staging, production).

---

## Running the stack locally
1. Start MongoDB (service, docker container, or Atlas cluster).
2. API server:
   ```bash
   cd server
   npm run dev
   # http://localhost:5000
   ```
3. Customer website:
   ```bash
   cd client
   npm run dev
   # http://localhost:3000
   ```
4. Admin dashboard:
   ```bash
   cd admin
   npm run dev
   # http://localhost:3001 (Next.js will choose the next free port if needed)
   ```

Keep the three processes running simultaneously for a full local environment.

---

## Creating admin users
Registration is not exposed in the admin UI, so create users via the API:
1. Open Postman (or curl/Insomnia).
2. Send a `POST` to `http://localhost:5000/api/auth/register`.
3. Choose **raw JSON** body:
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "strongpassword"
   }
   ```
4. Submit the request. After a 201 response you can log in to the admin dashboard using the same credentials.

---

## Email service (Brevo)
The backend sends transactional emails (order updates, password resets, etc.) via Brevo (formerly Sendinblue) using NodeMailer.
1. Generate SMTP credentials inside the Brevo dashboard.
2. Store the username/password in `SMTP_USER` and `SMTP_PASS`.
3. Set `SENDER_EMAIL` to a verified sender address.
4. Restart the server whenever credentials change so the transporter reloads them.

---

## Common commands
| Location | Install deps | Start dev server | Production build |
|----------|--------------|------------------|------------------|
| server   | `npm install` | `npm run dev`    | `npm start` (after `npm run build` if defined) |
| client   | `npm install` | `npm run dev`    | `npm run build && npm run start` |
| admin    | `npm install` | `npm run dev`    | `npm run build && npm run start` |

---

## Deployment notes
- Public site: https://haddi-fast-foods.vercel.app/. Use `npm run build && npm run start` locally to mirror the hosted environment.
- Ensure MongoDB is running before starting the API; connection failures abort the server start-up.
- Before pushing changes run:
  ```bash
  git status
  git add README.md
  git commit -m "Improve README"
  git push origin main
  ```

---

Need help? Create an issue or reach the maintainers listed above.
