
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyEmailLink() {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");

        setStatus("success");
        setTimeout(() => {
          navigate("/auth/verify-email/success");
        }, 1000);
      } catch (err) {
        console.error("Verify failed:", err.message);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === "loading" && <p>Đang xác thực email...</p>}
      {status === "success" && <p>Email đã được xác thực thành công </p>}
      {status === "error" && (
        <p className="text-red-500">Xác thực thất bại </p>
      )}
    </div>
  );
}
