import {db} from "../Config/db/drizzle.js";
import {sql} from "drizzle-orm";



export const getRecommendedFriends = async (req, res) => {
    const user = req.user
    const userId = user.id

    try {
        const recommendedFriendsQuery = await db.execute(sql`
        SELECT u.id, u.lastname, u.firstname, u.email, u.picture, u.native_language, u.learning_language, u.location
        FROM users u
        WHERE u.id != ${userId}
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
            return res.json({
                success: false,
                message: "Aucune recommandations disponibles"
            })
        }
        return res.json({
            recommendedFriends,
        })
    } catch (e) {
        return res.json({
            success: false,
            message: e.message,
            error: e
        })
    }
}
