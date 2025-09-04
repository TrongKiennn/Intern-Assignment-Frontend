import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { refreshAccessToken, logout } from "@/store/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken, isLoggedIn } = useSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await dispatch(refreshAccessToken()).unwrap();
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn && !accessToken) return <Navigate to="/auth/login" replace />;

  return children;
};

export default ProtectedRoute;
