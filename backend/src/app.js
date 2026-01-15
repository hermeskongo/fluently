import 'dotenv/config'
import express from "express"
import {testDrizzle} from "./Config/db/drizzle.js";
import {authRoutes} from "./Routes/auth.routes.js";

const app = express()

const port = process.env.PORT

testDrizzle()

app.use(express.json())

app.use('/api/v1/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`)
})