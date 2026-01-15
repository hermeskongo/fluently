import {db} from "../Config/db/drizzle.js";
import {usersTable} from "../Config/db/schema.js";
import {and, eq} from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const expireIn = 7 * 24 * 60 * 60


/**
 *
 * Fonction permettant de créer le token d'authentification et de l'ajouter aux cookies
 *
 * @param payload Le payload à mettre au niveau de la méthode .sign() (ici l'id du user)
 * @param res
 */
function createTokenAndSetCookie(payload, res) {

    const token = jwt.sign({userId: payload}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token,{
        maxAge: expireIn,
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
}


// Inscription de l'utilisateur
export const register = async (req, res) => {
    const {firstname, lastname, email, password} = req?.body

    if(!firstname || !lastname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs sont requis"
        })
    }
    if(password.length<6) {
        return res.status(400).json({
            success: false,
            message: "Le mot de passe doit contenir 6 caractères."
        })
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Veuillez entrer un e-mail valide"
        })
    }

    try {

        const existingUser = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, email)
        })

        if(existingUser) {

            return res.status(400).json({
                success: false,
                message: "Cet e-mail est déjà utilisé !"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [createdUser] = await db.insert(usersTable)
            .values({
                firstname,
                lastname,
                email,
                password: hashedPassword
            }).returning()

        if(createdUser) {
            // TODO: CREATE USER IN STREAM

            // Authentification immédiate de l'utilisateur dès son inscription
            createTokenAndSetCookie(createdUser.id, res)

            return res.status(201).json({
                success: true,
                message: "Inscription réussi !"
            })
        }

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            error: e
        })
    }

}
