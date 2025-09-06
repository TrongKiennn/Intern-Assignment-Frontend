import { useState } from "react";
import { cn } from "components/lib/utils";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import PasswordInput from "../Utils/PasswordInput";

export function RegisterForm({ className, ...props }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [serverError, setServerError] = useState("");

  const validateField = (name, value) => {
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: value.includes("@") ? "" : "Email must include @",
      }));
    }
    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password:
          value.length >= 8 ? "" : "Password must be at least 8 characters",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
      } else {
        setServerError(
          data?.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "" &&
    !errors.name &&
    !errors.email &&
    !errors.password;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 min-h-screen justify-center items-center bg-black text-white",
        className
      )}
      {...props}
    >
      <Card className="bg-neutral-900 text-white w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription className="text-gray-400">
            Please fill in the details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Name */}
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your fullname"
                  value={form.name}
                  onChange={handleChange}
                  style={{ borderColor: errors.name ? "red" : "" }}
                  className="bg-neutral-800 text-white"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={{ borderColor: errors.email ? "red" : "" }}
                  className="bg-neutral-800 text-white"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <PasswordInput
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                />
              </div>

              <Button type="submit" className="w-full" disabled={!isFormValid}>
                Sign up
              </Button>

              {serverError && (
                <p className="text-red-500 text-sm text-center">
                  {serverError}
                </p>
              )}

              {/* Divider */}
              <div className="relative text-center text-sm">
                <span className="bg-neutral-900 relative z-10 px-2">
                  Or continue with
                </span>
                <div className="absolute inset-0 top-1/2 border-t border-gray-700"></div>
              </div>

              {/* Social Buttons */}
              <div className="w-full grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 bg-neutral-900 text-white border border-gray-600 rounded-md py-2"
                >
                  <FaFacebook size={20} />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 bg-neutral-900 text-white border border-gray-600 rounded-md py-2"
                >
                  <FcGoogle size={20} />
                  Google
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="underline underline-offset-4 text-blue-400"
                >
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-gray-500 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 text-blue-400">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 text-blue-400">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
