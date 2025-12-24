import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import mongoose from "mongoose"
import morgan from 'morgan';
import cors from "cors";
import "dotenv/config";

import cookieParser from "cookie-parser";


import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import mediaRoutes from './routes/media.routes.js';

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import roleRouter from "./routes/role.routes.js"

import Role from "./models/role.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.Port || 4000;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000', 'https://haddi-fast-foods.vercel.app/',]

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));


app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/admin", adminRouter)
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/roles', roleRouter);

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public', 'uploads'))
);

app.get('/', (req, res) => {
    res.send("Server is active!")
})


mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB successfully!");

        await initRoles();

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        })
    })
    .catch((err) => {
        console.error("MongoDB connection error :", err);
    });


async function initRoles() {
    const roles = ["user", "admin"];
    for (let name of roles) {
        const exists = await Role.findOne({ name });
        if (!exists) {
            await new Role({ name }).save();
            console.log(`Role ${name} created`);
        }
    }
}