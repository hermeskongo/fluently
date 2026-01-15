import "dotenv/config"
import {StreamChat} from "stream-chat";

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret) {
    console.error("API_KEY or API_SECRET missing")
}

const StreamClient = StreamChat.getInstance(apiKey, apiSecret)


// Create if not exist and update
export async function upsertStreamUser(userData) {
    try {
        await StreamClient.upsertUsers([userData])
    } catch (e) {
        console.error("Erreur upserting stream user",e)
    }
}
