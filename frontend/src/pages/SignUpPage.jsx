import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Input } from '../components/Form/Input';
import {signup} from "../lib/api.js";

export default function SignUpPage() {
  const [signUpData, setSignUpData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: ""
  })

  function handleChange(e) {
      const { name, value } = e.target;
      
      setSignUpData((prevState) => ({
        ...prevState,
        [name]: value
      }));
  }

  const queryClient = useQueryClient()

  const {mutate:signupMutation, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess:() =>  queryClient.invalidateQueries({queryKey: ["authUser"]})
  })

  async function handleSubmit(e) {
    e.preventDefault()
    signupMutation(signUpData);
  }
  return ( 
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-6" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row rounded-xl shadow-lg w-full max-w-5xl overflow-hidden mx-auto bg-base-100">

        {/* SIGNUP PAGE LEFT PART */}
        <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-8">
          <div className="mb-4 flex items-center justify-start gap-3">
            <Globe className="size-9 text-primary"/>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Fluently
              </span>
          </div>
          <div className='w-full'>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Créez un compte</h2>
                <p className='text-sm opacity-70 italic'>Talk Your Way to Real Language Fluency !</p>
              </div>
              {/* DISPLAY ERROR MESSAGE IF ANY */}
              {error && <div className="alert alert-error mt-4">
                <span>{error?.response?.data?.message}</span>
              </div>}
              <div className='mt-8 space-y-3'>
                <Input label="Nom" name="lastname" value={signUpData.lastname} setValue={handleChange}/>
                <Input label="Prénom" name="firstname" value={signUpData.firstname} setValue={handleChange}/>
                <Input label="E-mail" name="email" value={signUpData.email} setValue={handleChange}/>
                <Input label="Mot de passe" type='password' name="password" value={signUpData.password} setValue={handleChange}/>
                <div className='form-control'>
                  <label className='label cursor-pointer justify-start gap-2'>
                    <input type="checkbox" className='checkbox checkbox-sm' required/>
                    <span className='text-xs leading-tight'>
                      J'accepte{" "}
                      <span className='text-primary hover:underline'>les termes </span> et{" "}
                      <span className='text-primary hover:underline'>les conditions</span>
                    </span>
                  </label>
                </div>
              </div>
              <button 
                type="submit"
                className='btn btn-primary w-full my-2'
                onSubmit={() => console.log("Submit")}
                disabled={isPending}
              >{isPending ?
                  ( <> <span className="loading loading-spinner loading-xs"></span> Loading... </> )
                    :
                  ( "Create Account" )
              }
              </button>
              <p className='text-xs text-center'>
                Vous avez déjà un compte ? <Link to="/login" className='hover:underline text-primary'>Connectez-vous </Link>
              </p>
            </form>
          </div>
        </div>

        {/* SIGNUP PAGE RIGHT PART */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/video.png" alt="SignUpPage illustration" />
            </div>
            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with language partner Worlwide</h2>
              <p className="opacity-70 text-sm">Pratice conversations, make friends and improve you language skills together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
