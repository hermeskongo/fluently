import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircleIcon, MapIcon, UserPlusIcon, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { FriendCard, getLanguageFlag } from '../components/Home/FriendCard'
import { NoFriendsFound } from '../components/Home/NofriendsFound'
import { getFriends, getOutGoingFriendReqs, getRecommendedUsers, sendFriendRequest } from '../lib/api'
import { capitalize, getFullName } from '../lib/help'

export const HomePage = () => {
  const [outGoingFriendsReqsIds, setOutGoingFriendsReqsIds] = useState(new Set());
  const queryClient = useQueryClient();

  // 1. Amis (sécurisé avec || [])
  const { data: friendsData, isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends
  });
  const friends = friendsData?.friends || []; // Toujours un tableau

  // 2. Recommandations
  const { data: recommendedUsersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers
  });
  const recommendedUsers = recommendedUsersData?.recommendedFriends || [];

  // 3. Demandes envoyées
  const { data: outGoingFriendsData, isLoading: loadingOutGoingFriendsReqs } = useQuery({
    queryKey: ["outGoingFriendsReqs"],
    queryFn: getOutGoingFriendReqs
  });
  const outGoingFriendsReqs = outGoingFriendsData?.requests || [];

  const { mutate: sendFriendRequestMutation, isPending, error } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Demande envoyée !");
      queryClient.invalidateQueries({ queryKey: ["outGoingFriendsReqs"] });
    }
  });

  // Correction de la boucle useEffect
  useEffect(() => {
    const outGoingIds = new Set();
    if (Array.isArray(outGoingFriendsReqs)) {
      outGoingFriendsReqs.forEach((req) => {
        if (req.friend_id) outGoingIds.add(req.friend_id);
      });
    }
    setOutGoingFriendsReqsIds(outGoingIds);
  }, [outGoingFriendsReqs]);

  return (
    <div className='p-4 sm:p-6 lg:p-8 h-full'> {/* h-full pour remplir le layout */}
      <div className='container mx-auto space-y-10'>
        
        {/* SECTION AMIS */}
        <section>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='font-bold text-2xl sm:text-3xl tracking-tight'>Vos amis</h2>
                <Link to="/notifications" className='btn btn-outline btn-sm rounded-3xl'>
                    <Users className='size-4 mr-2' />
                    Demandes
                </Link>
            </div>

            {loadingFriends ? (
                <div className='flex justify-center py-12'><span className='loading loading-spinner loading-lg'></span></div>
            ) : friends.length === 0 ? (
                <NoFriendsFound />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {friends.map((friend) => (
                        <FriendCard key={friend.id} friend={friend} />
                    ))}
                </div>
            )}
        </section>

        {/* SECTION RECOMMANDATIONS */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Plus d'amis</h2>
            <p className="opacity-70">Découvrez des partenaires de langues parfaits !</p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outGoingFriendsReqsIds.has(user.id);

                return (
                  <div key={user.id} className="card bg-base-200 hover:shadow-lg transition-all">
                    <div className="card-body p-5">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                           <div className="size-16 rounded-full border border-primary/10">
                              <img src={user.picture || "/avatar-placeholder.png"} alt={user.firstname} />
                           </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{getFullName(user)}</h3>
                          {user.location && <div className="text-xs opacity-60 flex items-center"><MapIcon className="size-3 mr-1"/>{user.location}</div>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="badge badge-secondary p-3">
                          {getLanguageFlag(user.native_language)} Native: {capitalize(user.native_language)}
                        </span>
                        <span className="badge badge-outline p-3">
                          {/* Correction du nom de clé ici : learning_language */}
                          {getLanguageFlag(user.learning_language)} Learning: {capitalize(user.learning_language)}
                        </span>
                      </div>

                      <button
                        className={`btn w-full mt-4 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendFriendRequestMutation(user.id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon/>
                            Demande envoyée
                          </>
                        ) : (
                          <>
                            <UserPlusIcon/>
                            Ajouter en ami
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};