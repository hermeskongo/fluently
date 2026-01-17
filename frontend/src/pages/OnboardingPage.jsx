import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CameraIcon, Loader, MapPinIcon, Shuffle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '../components/Form/Input.jsx';
import { Select } from '../components/Form/Select.jsx';
import { TextArea } from '../components/Form/TextArea.jsx';
import { LANGUAGES, profileBG } from '../constants/index.js';
import { useAuth } from "../hooks/useAuth.js";
import { onboardUser } from '../lib/api.js';

export const OnboardingPage = () => {
  const {authUser} = useAuth();
  const [formState, setFormState] = useState({
    firstname: authUser?.firstname || "",
    lastname: authUser?.lastname || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    picture: authUser?.picture || "",
  })

  function handleInputChange(e) {
    const {name, value} = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const queryClient = useQueryClient()

  const {mutate:onboardingMutation, isPending} = useMutation({
    mutationFn: onboardUser,
    onSuccess: () => {
      toast.success("Finalisation terminé !🎉")
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    }
  })

  async function handleSubmit(e) {
    e.preventDefault()
    onboardingMutation(formState)
  }

  // Fonction pour générer une couleur aléatoire
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * profileBG.length);
    return profileBG[randomIndex];
  };

  // Fonction pour générer l'avatar
  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7); // Utilisation d'un seed aléatoire
    const randomColor = getRandomColor();

    const newAvatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=${randomColor}&radius=50`;
    setFormState(prev => ({ ...prev, picture: newAvatarUrl }));

    toast.success("Photo de profile générer !")
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-base-100 p-4' data-theme="forest" >
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-4 sm:p-6">
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Finalisez votre inscription</h1>

          {/* PROFILE PICTURE PART */}
          <div className='flex flex-col items-center justify-center'>
            <div className='size-20 md:size-28 rounded-full bg-base-300 overflow-hidden'>
                {formState.picture ?
                  (
                    <img 
                      src={formState.picture}
                      alt="Votre photo de profile de l'utilisateur"
                      className='size-full object-cover'
                    />
                  ) : (
                    <div className='flex items-center justify-center h-full'>
                      <CameraIcon className='size-8 md:size-12 text-base-content opacity-40'/>
                    </div>
                  )
                }
            </div>
            <button 
              onClick={generateRandomAvatar}
              className='btn btn-accent flex items-center justify-between my-3'
            >
              <Shuffle/>
              Génerer une photo aléatoirement !
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            <Input 
              name="firstname"
              id="firstname"
              value={formState.firstname} 
              setValue={handleInputChange} 
              label="Prénom" 
              placeholder='John' 
            />
            <Input 
              name="lastname" 
              id="lastname" 
              value={formState.lastname} 
              setValue={handleInputChange} 
              label="Nom" 
              placeholder='Doe'
            />
            <TextArea 
              id="bio" 
              name="bio" 
              value={formState.bio} 
              setValue={handleInputChange} 
              label="Bio" 
              placeholder="Ex: Je suis développeur passioné cherhcant à apprendre d'autres langues comme le chinois, l'espagnol l'anglais..."
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <Select 
                name="nativeLanguage"
                options={LANGUAGES}
                defaultValue="Veuillez choisir une option"
                value={formState.nativeLanguage}
                onChange={handleInputChange}
                id={"native"}
                label={"Langue maternel"}
              />
              <Select 
                name="learningLanguage"
                options={LANGUAGES}
                defaultValue="Veuillez choisir une option"
                value={formState.learningLanguage}
                onChange={handleInputChange}
                id={"learning"}
                label={"Langue à apprendre"}
              />
            </div>
            <Input 
              name="location" 
              id="location" 
              value={formState.location} 
              leftIcon={MapPinIcon} 
              setValue={handleInputChange} 
              label="Localisation"
              placeholder='Ville, Pays (e.g: Burkina Faso, Ouagadougou)'
            />
              <button 
                type="submit"
                className='btn btn-primary w-full my-2'
                disabled={isPending}
              >{isPending ?
                  ( <> 
                      <Loader className="animate-spin size-4"></Loader> Traitement... </> )
                    :
                  ( "Soumettre" )
              }
              </button>
          </form>
        </div>
      </div>
    </div>
  )
}
