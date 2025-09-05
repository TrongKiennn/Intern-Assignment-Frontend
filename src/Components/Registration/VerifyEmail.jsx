import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    try {
      const res = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Verification failed.");
      } else {
        navigate("/verify-email/success");
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
        <CardHeader className=" space-y-2">
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
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, i) => (
              <Input
                key={i}
                id={`otp-${i}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                maxLength={1}
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
