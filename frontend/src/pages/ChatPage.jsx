import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { StreamChat } from "stream-chat"
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react"
import { CallButton } from '../components/Chat/CallButton'
import ChatLoader from '../components/Chat/ChatLoader'
import { useAuth } from '../hooks/useAuth'
import { getStreamToken } from '../lib/api'


export const ChatPage = () => {
  const { id: tardgetUserId } = useParams()
  const { authUser } = useAuth()

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)


  const { data: tokenData, error } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser // Query work until authUser is available
  })
  const token = tokenData?.token || ""


  const generateChannelId = (id1, id2) => {
    const rawId = [id1.toString(), id2.toString()].sort().join("-");

    // Hash simple pour réduire la longueur à 32-40 caractères
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      const char = rawId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en entier 32bit
    }
    // On retourne un ID préfixé, propre et court
    return `chan-${Math.abs(hash)}`;
  };


  useEffect(() => {
    const initChat = async () => {
      if (!token || !authUser) return
      try {
        console.log("Initializing stream chat client...")
        const client = StreamChat.getInstance(STREAM_API_KEY)
        await client.connectUser({
          id: authUser.id.toString(),
          name: `${authUser.lastname} ${authUser.firstname}`,
          image: authUser.picture || ""
        }, token)

        const channelId = generateChannelId(authUser?.id, tardgetUserId)
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser?.id, tardgetUserId]
        })

        await currChannel.watch()

        setChatClient(client)
        setChannel(currChannel)

      } catch (error) {
        console.error(error)
        toast.error("Erreur, rééssayer plus-tard !")
      } finally {
        setLoading(false)
      }
    }
    initChat()

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };

  }, [token, authUser, tardgetUserId])


  async function handleVideoCall() {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}/${tardgetUserId}`
      channel.sendMessage({
        text: `Rejoins moi pour un appel vidéo en cliquant sur ce lien !: ${callUrl}`
      })
      toast.success("Lien d'appel créé avec succès !🎉")
    }

  }

  if (loading || !chatClient || !channel) return <ChatLoader />

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus AudioRecoder={true} />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}
