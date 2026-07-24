import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';
import express from "express";
import { testDrizzle } from "./Config/db/drizzle.js";
import { authRoutes } from "./Routes/auth.routes.js";
import { chatRoutes } from "./Routes/chat.routes.js";
import { userRoutes } from "./Routes/user.routes.js";

const app = express()

const port = process.env.PORT

testDrizzle()

// Le front est servi separement (Vercel) : on autorise explicitement ses origines.
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://fluently-swart.vercel.app",
]

app
    .use(cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }))
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())

// Sonde de disponibilite (utilisee par l'hebergeur pour le health check)
app.get('/', (req, res) => res.json({ status: "ok", service: "fluently-api" }))

app
    .use(express.json())
    .use('/api/auth', authRoutes)
    .use('/api/users', userRoutes)
    .use('/api/chat', chatRoutes)

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`)
})
