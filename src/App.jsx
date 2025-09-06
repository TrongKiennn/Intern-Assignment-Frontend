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
import AuthLayout from "./Components/Layout/AuthLayout";
import AppShell from "./Components/Layout/AppShell";
import VerifyEmailLink from "./Components/Registration/VerifyEmailByLink";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/auth/login"
            element={
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            }
          />
          <Route
            path="/auth/registration"
            element={
              <AuthLayout>
                <RegisterForm />
              </AuthLayout>
            }
          />
          <Route
            path="/auth/verify-email"
            element={
              <AuthLayout>
                <VerifyEmailPage />
              </AuthLayout>
            }
          />

          <Route
            path="/auth/verify-email/link"
            element={
              <AuthLayout>
                <VerifyEmailLink />
              </AuthLayout>
            }
          />
          <Route
            path="/auth/verify-email/success"
            element={
              <AuthLayout>
                <EmailVerifySuccess />
              </AuthLayout>
            }
          />
          <Route
            path="/onboarding"
            element={
              <AuthLayout>
                <Onboarding />
              </AuthLayout>
            }
          />

          <Route element={<AppShell />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
