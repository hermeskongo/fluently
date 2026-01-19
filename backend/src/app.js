import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';
import express from "express";
import path from "path";
import { testDrizzle } from "./Config/db/drizzle.js";
import { authRoutes } from "./Routes/auth.routes.js";
import { chatRoutes } from "./Routes/chat.routes.js";
import { userRoutes } from "./Routes/user.routes.js";

const __dirname = path.resolve()

const app = express()

const port = process.env.PORT

testDrizzle()

app
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(cors({
        origin: [
            "http://localhost:5174",
            "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }))

app
    .use(express.json())
    .use('/api/v1/auth', authRoutes)
    .use('/api/v1/users', userRoutes)
    .use('/api/v1/chat', chatRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}



app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`)
})