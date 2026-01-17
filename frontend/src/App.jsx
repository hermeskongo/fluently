import { useQuery } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from './components/UI/PageLoader.jsx';
import { API_PATHS } from "./lib/api.js";
import { axiosInstance } from "./lib/axios.js";
import { CallPage } from "./pages/CallPage.jsx";
import { ChatPage } from "./pages/ChatPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { OnboardingPage } from "./pages/OnboardingPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

export const  App = () => {

  const {data:authData, isLoading, error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER)
      return res.data
    },
    retry: false
  })

  const authUser = authData?.user
  

  if(isLoading) return <PageLoader/>

  return (
    <div className="h-screen font-sans" data-theme="night">
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/onboarding" element={authUser ? <OnboardingPage/> : <Navigate to="/login"/>}/>
        <Route path="/chat" element={authUser ? <ChatPage/> : <Navigate to="/login"/>}/>
        <Route path="/call" element={authUser ? <CallPage/> : <Navigate to="/login"/>}/>
      </Routes>
    </div>
  )
}

