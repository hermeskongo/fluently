import { CallControls, CallingState, SpeakerLayout, StreamCall, StreamTheme, StreamVideo, StreamVideoClient, useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLoader } from '../components/UI/PageLoader';
import { useAuth } from '../hooks/useAuth';
import { getStreamToken } from '../lib/api';
import { getFullName } from '../lib/help';

import '@stream-io/video-react-sdk/dist/css/styles.css';

export const CallPage = () => {
  const { id: callId, chatId } = useParams();
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const { authUser } = useAuth();

  const [call, setCall] = useState(null);
  const [callClient, setCallClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { data: callDataToken, isLoading } = useQuery({
    queryKey: ["streamCall"],
    queryFn: getStreamToken,
    enabled: !!authUser
  });
  const callToken = callDataToken?.token;

  useEffect(() => {
    const initCall = async () => {
      if (!authUser || !callId || !callToken) return;

      const formattedUser = {
        id: authUser?.id.toString(),
        name: getFullName(authUser),
        image: authUser?.picture || ""
      };
      try {
        const client = new StreamVideoClient({ apiKey: STREAM_API_KEY, user: formattedUser, token: callToken });
        const call = client.call('default', callId);
        await call.join({ create: true, audio: true, video: true });
        await call.camera.enable();

        console.log("Appel vidéo rejoint avec succès !");

        setCallClient(client);
        setCall(call);
      } catch (error) {
        console.error("Erreur lors de la création du client vidéo :", error);
        toast.error("Impossible de rejoindre l'appel. Veuillez réessayer !");
      } finally {
        setIsConnecting(false);
      }
    };
    initCall();
  }, [authUser, callDataToken, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col md:flex-row">
      {callClient && call ? (
        <StreamVideo client={callClient}>
          <StreamCall call={call}>
            <CallContent chatId={chatId} />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full w-full text-white text-center px-4">
          <p>Impossible de réaliser cet appel. Veuillez rafraîchir ou réessayer plus tard !</p>
        </div>
      )}
    </div>
  );
};

export const CallContent = ({ chatId }) => {
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) {
    call.camera.disable();
    call.microphone.disable();
    navigate(chatId ? `/chat/${chatId}` : '/');
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Vidéo principale */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <StreamTheme>
          <SpeakerLayout className="w-full h-full md:h-[90%] md:w-[90%] rounded-lg shadow-lg" />
        </StreamTheme>
      </div>

      {/* Participants */}
      <div className="md:w-1/4 flex md:flex-col flex-row overflow-x-auto md:overflow-y-auto bg-gray-800 p-2">
        <StreamTheme>
          <CallControls className="mx-auto md:my-2 flex md:flex-col space-x-4 md:space-x-0 md:space-y-2" />
        </StreamTheme>
      </div>
    </div>
  );
};
