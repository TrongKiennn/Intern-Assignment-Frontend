import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/authSlice";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  // if (isLoggedIn) navigate("/dashboard");

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
    const result = await dispatch(login(form));
    const userId = result.payload.user?.id;
    const done = localStorage.getItem(`onboarding_${userId}`) === "true";
    if (result.meta.requestStatus === "fulfilled") {
      if (done) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }
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
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription className="text-gray-400">
              Login with your Facebook or Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {/* Social Buttons */}
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full">
                    Login with Facebook
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative text-center text-sm">
                  <span className="bg-neutral-900 relative z-10 px-2">
                    Or continue with
                  </span>
                  <div className="absolute inset-0 top-1/2 border-t border-gray-700"></div>
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
                    <a
                      href="#"
                      className="ml-auto text-sm text-blue-400 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ borderColor: errors.password ? "red" : "" }}
                    className="bg-neutral-800 text-white"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Backend error */}
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 text-blue-400"
                  >
                    Sign up
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
  };

