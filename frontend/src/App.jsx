import {Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {OnboardingPage} from "./pages/OnboardingPage.jsx";
import {ChatPage} from "./pages/ChatPage.jsx";
import {CallPage} from "./pages/CallPage.jsx";

export const  App = () => {

  return (
    <div className="h-screen font-sans" data-theme="night">
      <Routes>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/onboarding" element={<OnboardingPage/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
        <Route path="/call" element={<CallPage/>}/>
      </Routes>
    </div>
  )
}

