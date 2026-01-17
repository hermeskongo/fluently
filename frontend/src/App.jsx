import {Navigate, Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {OnboardingPage} from "./pages/OnboardingPage.jsx";
import {ChatPage} from "./pages/ChatPage.jsx";
import {CallPage} from "./pages/CallPage.jsx";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "./lib/axios.js";
import {API_PATHS} from "./lib/api.js";

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

