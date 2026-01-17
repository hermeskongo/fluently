import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from './components/UI/PageLoader.jsx';
import { useAuth } from "./hooks/useAuth.js";
import { CallPage } from "./pages/CallPage.jsx";
import { ChatPage } from "./pages/ChatPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { OnboardingPage } from "./pages/OnboardingPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

export const  App = () => {

  const {authUser, isLoading, error} = useAuth()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if(isLoading) return <PageLoader/>

  return (
    <div className="h-screen font-sans" data-theme="night">
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
            <HomePage/>
            ) : (
                <Navigate to={!isOnboarded ? "/onboarding" : "/login"}/>
        )}/>

        <Route path="/signup" element={!isAuthenticated ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to={isOnboarded ? "/" : "/onboarding"}/>}/>

        <Route path="/onboarding" element={isAuthenticated && !isOnboarded ? (
            <OnboardingPage/>
            ) : (
                <Navigate to={isOnboarded ? "/home" : "/login"}/>
        )}/>

        <Route path="/chat" element={isAuthenticated ? <ChatPage/> : <Navigate to="/login"/>}/>
        <Route path="/call" element={isAuthenticated ? <CallPage/> : <Navigate to="/login"/>}/>
      </Routes>

      
        <Toaster
            toastOptions={{
                className: "",
                style: {fontSize: 13}
            }}
        />
    </div>
  )
}

