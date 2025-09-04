
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from './Components/login-form'
import Dashboard from './Components/dashboard';


function App() {

  return (
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

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
