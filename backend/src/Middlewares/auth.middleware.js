import jwt from "jsonwebtoken";
import "dotenv/config"
import {db} from "../Config/db/drizzle.js";
import {eq} from "drizzle-orm";
import {usersTable} from "../Config/db/schema.js";
import {getUserWithoutPassword} from "../utils/utils.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if(!token) return res.status(401).json({success: false, message: "Veuillez vous connectez pour accéder à cette page"})

        const decoded = jwt.decode(token, process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({success: false, message: "Veuillez vous connectez pour accéder à cette page"})

        const user = getUserWithoutPassword(await db.query.usersTable.findFirst({
            where: eq(usersTable.id, decoded.userId)
        }))
        if(!user) {
            res.clearCookie("jwt")
            return res.status(401).json({success: false, message: "Veuillez vous connectez pour accéder à cette page"})
        }

        req.user = user
        next()
    } catch (e) {
        console.error("Something went wrong in authentication middleware :(")
    }
}

// Algorithme du Middleware:
    // Récupérer le token dans le cookie
        // S'il n'existe pas, erreur
        // Sinon, on poursuit
            // Décoder le token
                // S'il n'existe pas, erreur
                // Sinon, on poursuit
            // Récupérer le payload
            // Vérifier que ce payload nous permet bel et bien de récupérer un user
                // Si bon, on next()
                // Sinon, on supprime le cookie et throw error