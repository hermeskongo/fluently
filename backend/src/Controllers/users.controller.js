import {db} from "../Config/db/drizzle.js";
import {and, eq, or, sql} from "drizzle-orm";
import {friendshipsTable, usersTable} from "../Config/db/schema.js";



export const getRecommendedFriends = async (req, res) => {
    const user = req.user
    const userId = user.id

    try {
        const recommendedFriendsQuery = await db.execute(sql`
        SELECT u.id, u.lastname, u.firstname, u.email, u.picture, u.native_language, u.learning_language, u.location, u.is_onboarded
        FROM users u
        WHERE u.id != ${userId}
        AND u.is_onboarded=true
        AND NOT EXISTS(
            SELECT 1
            FROM friendships f
            WHERE(
                (f.user_id = ${userId} AND f.friend_id = u.id)
                OR
                (f.user_id = u.id AND f.friend_id = ${userId})
            )
            AND f.status IN ('pending', 'accepted')
        )
        ORDER BY u.firstname ASC
    `)
        const recommendedFriends = recommendedFriendsQuery.rows

        if(!recommendedFriends) {
            return res.status(400).json({
                success: false,
                message: "Aucune recommandations disponibles"
            })
        }
        return res.json({
            success: true,
            recommendedFriends,
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            error: e
        })
    }
}

export const sendFriendRequest = async (req, res) => {
    const {friend_id} = req.body
    const user = req.user

    if(!user.id || !friend_id) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs sont requis"
        })
    }
    if(friend_id === user.id) {
        return res.status(400).json({
            success: false,
            message: "Vous ne pouvez pas vous envoyez une requête à vous même"
        })
    }

    try {
        const friend = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, friend_id),
            columns: {
                password: false
            }
        })
        if (!friend) {
            return res.status(400).json({
                success: false,
                message: "Cet ami n'existe pas/plus dans notre base de données"
            })
        }
        const friendship = await db.query.friendshipsTable.findFirst({
            where: or(
                and(eq(friendshipsTable.user_id, user.id), eq(friendshipsTable.friend_id, friend_id)),
                and(eq(friendshipsTable.user_id, friend_id), eq(friendshipsTable.friend_id, user.id))
            )
        })

        if(friendship) {
            switch (friendship.status) {
                case "pending":
                    return res.status(400).json({
                        success: false,
                        message: "Une requête d'amitié entre vous et cette personne existe déjà."
                    })

                case "accepted":
                    return res.status(400).json({
                        success: false,
                        message: "Vous êtes déjà ami avec cette personne !"
                    })

                default:
                    console.log("Erreur switch case < friendships | status>")
                    break
            }
        }

        // Si tout est correct, on fait la demande d'amitié !
        const request = await db.insert(friendshipsTable)
            .values({
                friend_id,
                user_id: user.id
            }).returning()

        return res.status(400).json({
            success: false,
            message: "Demande d'amitié envoyé avec succès",
            request
        })

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            error: e
        })
    }

}

export const acceptFriendRequest = async(req, res) => {
    const {friendshipId} = req.body
    const user = req.user

    if(!friendshipId) {
        return res.status(400).json({
            success: false,
            message: "Ce lien n'existe pas dans notre base de données"
        })
    }

    try {
        const friendship = await db.query.friendshipsTable.findFirst({
            where: eq(friendshipsTable.id, friendshipId)
        })

        if (!friendship) {
            throw new Error('Demande introuvable');
        }

        // Vérifier que c'est bien le destinataire qui accepte
        if (friendship.friend_id !== user.id) {
            throw new Error('Non autorisé');
        }

        // Vérifier que le statut est "pending"
        if (friendship.status !== 'pending') {
            throw new Error('La demande n\'est plus en attente');
        }

        // Accepter la demande
        const [updatedFriendship] = await db
            .update(friendshipsTable)
            .set({
                status: 'accepted',
                accepted_at: new Date()
            })
            .where(eq(friendshipsTable.id, friendshipId))
            .returning();

        return res.status(200).json({
            success: false,
            message: `✅ Demande acceptée: ${friendshipId}`,
            updatedFriendship
        })


    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }

}

export const getMyFriends = async (req, res) => {
    const user = req.user
    try {
        const friends = await db.query.friendshipsTable.findMany({
            where:(table, {and, or, eq}) => and(
                or(
                    eq(table.friend_id, user.id),
                    eq(table.user_id, user.id)
                ),
                eq(table.status, 'accepted')
            ),

        })
        if(!friends) {
            return res.status(404).json({
                success: false,
                message: "Vous n'avez aucun amis :("
            })
        }
        return res.json({
            success: true,
            friends
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: e,
            message: e.message
        })
    }
}

export const getFriendRequests = async (req, res) => {
    const user = req.user

    try {
        const requests = await db.query.friendshipsTable.findMany({
            where:(table, {and, or, eq}) => and(
                    or(eq(table.user_id, user.id), eq(table.friend_id, user.id)),
                    or(eq(table.status, 'accepted'), eq(table.status, 'pending'))
                ),
            with: {
                friend: {
                    columns: {
                        password: false
                    }
                }
            }
        })

        return res.json({
            success: true,
            requests
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: e
        })
    }
}

export const getOutGoingFriendRequests = async (req, res) => {
    const user = req.user

    try {
        const requests = await db.query.friendshipsTable.findMany({
            where: and(eq(friendshipsTable.user_id, user.id), eq(friendshipsTable.status, "pending")),
            with: {
                friend: {
                    columns: {
                        password: false
                    }
                }
            }
        })


        return res.json({
            success: true,
            requests
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            error: e
        })
    }

}