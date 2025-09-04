import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../lib/helper/fetchWithAuth"; 
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:3000/dashboard");
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch dashboard");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getDashboard();
  }, []);


  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
