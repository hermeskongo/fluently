import express from "express";
import {getStreamToken} from "../Controllers/chat.controller.js";
import {isAuthenticated, isOnboarded} from "../Middlewares/auth.middleware.js";

export const chatRoutes = express.Router()

chatRoutes.get('/token', isAuthenticated, isOnboarded, getStreamToken)