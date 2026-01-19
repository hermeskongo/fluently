import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "../Config/db/drizzle.js";
import { usersTable } from "../Config/db/schema.js";
import { upsertStreamUser } from "../Config/Stream/streamchat.js";
import { getUserWithoutPassword } from "../utils/utils.js";

const expireIn = 7 * 24 * 60 * 60 * 1000


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
        sameSite: "lax",
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
    if(firstname.toLowerCase().includes("quadra") || firstname.toLowerCase().includes("quadra")|| email.toLowerCase().includes("quadra")) {
        return res.status(400).json({
            success: false,
            message: "Ahad pardon 🙏. Salopard la un peu de sérieux 😭😭😭😭.\nChange ton quadra la pardon man!"
        })
    }
    if(password.length<6) {
        return res.status(400).json({
            success: false,
            message: "Le mot de passe doit contenir au moins 6 caractères."
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
        
            try {
                await upsertStreamUser({
                    id: createdUser.id.toString(),
                    name: `${createdUser.lastname} ${createdUser.firstname}`,
                    image: createdUser.picture || ""
                })
                console.log("User stream created successfully !")
            } catch (e) {
                console.log("Error creating stream user")
            }

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

// Connexion de l'utilisateur
export const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs sont requis !"
        })
    }

    try {

        // On récupère d'abord l'utilisateur correspond à l'email
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, email)
        })

        // S'il n'y a pas de user trouvé, on retourne une Response 401 !
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect !" // Message volontairement vague
            })
        }

        //Sinon, on récupère on compare maintenant le mot de passe Hashé à celui saisi
            // Si le mot de passe n'est pas correct, on retourne une Response 401
        if(!bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect !" // Message volontairement vague
            })
        }

        // Sinon Tout est OK
        // on créer le jwt_token et on l'ajoute aux cookies pour ensuite authentifier l'utilisateur
        createTokenAndSetCookie(user.id, res)

        // Et on retourne une Response 200
        return res.json({
            success: true,
            message: "Connexion réussie !"
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            error: e
        })
    }

}


// Déconnexion de l'utilisateur
export const logout = async (req, res) => {
    res.clearCookie("jwt")
    return res.json({
        success: true,
        message: "Déconnexion réussie !"
    })
}

// Récupérer les informations de l'utilisateur en ligne
export const getUser = async (req, res) => {
    try {
        return res.json({
            success: true,
            user: {
                fullname: `${req.user.firstname} ${req.user.lastname}`,
                ...req.user
            }
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            error: e
        })
    }
}


// Onboarding de l'utilisateur
export const onboard = async (req, res) => {
    const {firstname, lastname, bio, nativeLanguage, learningLanguage, location, picture} = req.body
    const user = req.user

    if(!bio || !nativeLanguage || !learningLanguage || ! location || !picture) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs non préremplis sont requis",
        })
    }
    if (user.isOnboarded) {
        return res.status(400).json({
            success: false,
            message: "Tu es déjà onboarded !",
        })
    }

    try {
        let updatedData = {
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            picture,
            isOnboarded: true,
            updated_at: new Date()
        }
        if(firstname) updatedData.firstname = firstname
        if(lastname) updatedData.lastname = lastname

        const [updatedUser] = await db.update(usersTable)
            .set(updatedData)
            .where(eq(usersTable.id, user.id))
            .returning()


        try {
            await upsertStreamUser({
                id: updatedUser.id.toString(),
                name: `${updatedUser.lastname} ${updatedUser.firstname}`,
                image: updatedUser.picture || ""
            })
            console.log("User stream updated after onboarding successfully !")
        } catch (e) {
            console.log("Error updating stream user")
        }

        return res.json({
            success: true,
            message: "Onboarding Successfully !",
            user: getUserWithoutPassword(updatedUser)
        })

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            error: e
        })
    }
}