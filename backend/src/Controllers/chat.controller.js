import {createStreamToken} from "../Config/Stream/streamchat.js";

export const getStreamToken = async (req, res) => {
    try {
        const token = createStreamToken(req.user.id)
        res.json({token})
    } catch (e) {
        return res.status(500).json({message: "Internal server error", error: e})
    }
}