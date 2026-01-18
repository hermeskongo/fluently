import { CallControls, CallingState, SpeakerLayout, StreamCall, StreamTheme, StreamVideo, StreamVideoClient, useCall, useCallStateHooks } from "@stream-io/video-react-sdk"
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLoader } from '../components/UI/PageLoader'
import { useAuth } from '../hooks/useAuth'
import { getStreamToken } from '../lib/api'
import { getFullName } from '../lib/help'


import '@stream-io/video-react-sdk/dist/css/styles.css'

export const CallPage = () => {
  const { id: callId, chatId } = useParams()

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

  const { authUser } = useAuth()

  const [call, setCall] = useState(null)
  const [callClient, setCallClient] = useState(null)
  const [isConnecting, setIsConnecting] = useState(true)

  const { data: callDataToken, isLoading } = useQuery({
    queryKey: ["streamCall"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })
  const callToken = callDataToken?.token

  useEffect(() => {
    const initCall = async () => {
      if (!authUser || !callId || !callToken) return

      const formattedUser = {
        id: authUser?.id.toString(),
        name: getFullName(authUser),
        image: authUser?.picture || ""
      }
      try {
        const client = new StreamVideoClient({ apiKey: STREAM_API_KEY, user: formattedUser, token: callToken })
        const call = client.call('default', callId)
        await call.join({
          create: true,
          audio: true,
          video: true
        })
        await call.camera.enable

        console.log("Appel video rejoint avec succès !")

        setCallClient(client)
        setCall(call)
      } catch (error) {
        console.error("Error on create video client :(", error)
        toast.error("Impossible de rejoindre l'appel. Veuillez rééssayer !")
      } finally {
        setIsConnecting(false)
      }

    }
    initCall()


  }, [authUser, callDataToken, callId])


  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative'>
        {callClient && call ? (
          <StreamVideo client={callClient}>
            <StreamCall call={call}>
              <CallContent id={chatId} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>Impossible de réaliser cet appel, Veuillez refresh ou réésayer plus-tard !</p>
          </div>
        )}
      </div>

    </div>
  );
}

export const CallContent = ({ id }) => {
  const call = useCall();

  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  const navigate = useNavigate()


  if (callingState === CallingState.LEFT) {
    call.camera.disable;
    call.microphone.disable;
    navigate(id ? `/chat/${id}` : '/')
  }

  return (
    <div>
      <StreamTheme>
        <SpeakerLayout />
        <CallControls />
      </StreamTheme>
    </div>
  );
};
