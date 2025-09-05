import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }

      // Nếu tất cả đã điền và người dùng nhấn giữ backspace → clear hết
      if (otp.every((ch) => ch)) {
        setOtp(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill("");
    [...pasted].forEach((ch, i) => {
      if (i < 6 && /^[a-zA-Z0-9]$/.test(ch)) {
        newOtp[i] = ch;
      }
    });
    setOtp(newOtp);
    inputsRef.current[newOtp.findIndex((x) => x === "") || 5]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Verification failed.");
      } else {
        navigate("/auth/verify-email/success");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  const handleResend = () => {
    alert("Resend code to email: " + email);
  };

  const isOTP = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <Card className="bg-neutral-900 text-white w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">Please check your email</CardTitle>
          <p className="text-gray-400 text-sm">
            Your registration has been successful. We have sent you an email
            with a verification link.
          </p>
          <p className="text-gray-400 text-sm">
            Alternatively you can use the one-time password in the email for
            verification.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <Input
                key={i}
                id={`otp-${i}`}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-10 h-12 text-center text-xl bg-neutral-800 border border-gray-600"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
          )}

          <Button onClick={handleVerify} className="w-full" disabled={!isOTP}>
            Verify
          </Button>

          <div className="text-center text-sm mt-3">
            Didn’t receive an email?{" "}
            <button
              onClick={handleResend}
              className="text-blue-400 underline underline-offset-4"
            >
              Resend
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
