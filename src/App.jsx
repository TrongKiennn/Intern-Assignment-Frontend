// import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./Components/Login/login-form";

import ProtectedRoute from "./Components/ProtectedRoute";
import { ThemeProvider } from "./Context/ThemeContext";
import Onboarding from "./Components/Onboarding/Onboarding";
import { RegisterForm } from "./Components/Registration/registration-form";
import VerifyEmailPage from "./Components/Registration/VerifyEmail";
import EmailVerifySuccess from "./Components/Registration/EmailVerifySuccess";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/auth/login"
            element={
              <div className="w-screen h-screen flex items-center justify-center bg-black">
                <LoginForm />
              </div>
            }
          />

          <Route
            path="/auth/registration"
            element={
              <div className="w-screen h-screen flex items-center justify-center bg-black">
                <RegisterForm />
              </div>
            }
          />

          <Route
            path="/auth/verify-email"
            element={
              <div className="w-screen h-screen flex items-center justify-center bg-black">
                <VerifyEmailPage />
              </div>
            }
          />

          <Route
            path="/auth/verify-email/success"
            element={
              <div className="w-screen h-screen flex items-center justify-center bg-black">
                <EmailVerifySuccess />
              </div>
            }
          />
          <Route
            path="/onboarding"
            element={
              <div className="w-screen h-screen flex items-center justify-center bg-black">
                <Onboarding />
              </div>
            }
          />

          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              //   <Dashboard />
              // </ProtectedRoute>
              <ThemeProvider>
                <Dashboard />
              </ThemeProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
