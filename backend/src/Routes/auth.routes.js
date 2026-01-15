import express from "express";
import {register} from "../Controllers/authController.js";

export const authRoutes = express.Router()

authRoutes.post('/register', register)