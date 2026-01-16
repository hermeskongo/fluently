import 'dotenv/config'
import express from "express"
import {testDrizzle} from "./Config/db/drizzle.js";
import {authRoutes} from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser"
import {userRoutes} from "./Routes/user.routes.js";
import {chatCodes} from "stream-chat";
import {chatRoutes} from "./Routes/chat.routes.js";

const app = express()

const port = process.env.PORT

testDrizzle()

app.use(express.json())
    .use(cookieParser())

app.use('/api/v1/auth', authRoutes)
    .use('/api/v1/users', userRoutes)
    .use('/api/v1/chat', chatRoutes)

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`)
})