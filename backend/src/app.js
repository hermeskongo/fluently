import 'dotenv/config'
import express from "express"
import {testDrizzle} from "./Config/db/drizzle.js";
import {authRoutes} from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser"
import {userRoutes} from "./Routes/user.routes.js";
import {chatRoutes} from "./Routes/chat.routes.js";
import cors from "cors"

const app = express()

const port = process.env.PORT

testDrizzle()

app
    .use(express.urlencoded({extended: true}))
    .use(cookieParser())
    .use(cors({
        origin: [
            "http://localhost:5174",
            "http://localhost:5173",
            "https://wild-paths-smash.loca.lt"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }))

app
    .use(express.json())
    .use('/api/v1/auth', authRoutes)
    .use('/api/v1/users', userRoutes)
    .use('/api/v1/chat', chatRoutes)

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`)
})