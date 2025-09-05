import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PasswordInput({ value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative w-full">

        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={18} />
        </span>

        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          value={value}
          onChange={onChange}
          placeholder="Enter your password"
          className="pl-10 pr-10 bg-neutral-800 text-white w-full"
          style={{ borderColor: error ? "red" : "" }}
          required
        />


        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>


      <div className="min-h-[20px]">
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
