import 'dotenv/config'
import express from "express"
import {testDrizzle} from "./Config/db/drizzle.js";

const app = express()

const port = process.env.PORT

testDrizzle()

app.get('/', (req, res) => {
    return res.send("Server launch !!")
})


app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`)
})