import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe } from "lucide-react";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import AuthLayout from '../components/Auth/AuthLayout.jsx';
import { Input } from '../components/Form/Input';
import { login } from '../lib/api';

export const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  function handleChange(e) {
    const {value, name} = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const queryClient = useQueryClient()

  const {mutate: loginMutation, isPending, error} = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]})
      toast.success("Connexion réussie !")
    }
  })

  console.log(error)
  
  function handleSubmit(e) {
    e.preventDefault()
    loginMutation(loginData)
  }

  return (
    <AuthLayout>
      <div>
          <div className="mb-4 flex  md:mt-15 items-center justify-start gap-3">
            <Globe className="size-9 text-primary"/>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Fluently
              </span>
          </div>
          <div className='w-full'>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Bon retour parmis nous !</h2>
                <p className='text-sm opacity-70 italic'>Nouez des relations tout en apprenant une nouvelle langue</p>
              </div>
              {/* DISPLAY ERROR MESSAGE IF ANY */}
              {error && <div className="alert alert-error mt-4">
                <span>{error?.response?.data?.message}</span>
              </div>}
              <div className='mt-8 space-y-3'>
                <Input label="E-mail" name="email" value={loginData.email} setValue={handleChange}/>
                <Input label="Mot de passe" type='password' name="password" value={loginData.password} setValue={handleChange}/>
              </div>
              <button 
                type="submit"
                className='btn btn-primary w-full my-2'
                disabled={isPending}
              >{isPending ?
                  ( <> <span className="loading loading-spinner loading-xs"></span> Connexion... </> )
                    :
                  ( "Soumettre" )
              }
              </button>
              <p className='text-xs text-center'>
                Pas encore de compte ? <Link to="/signup" className='hover:underline text-primary'>Inscrivez-vous </Link>
              </p>
            </form>
          </div>
      </div>
    </AuthLayout>
  )
}
