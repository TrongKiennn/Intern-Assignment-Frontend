import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContactItem({ name, count, url }) {
  const navigate = useNavigate();

  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      onClick={() => url && navigate(url)}
      className="flex items-center justify-between rounded-lg px-2 py-1 cursor-pointer
                 hover:bg-white/10 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
          {initials}
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>
     
      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-70 transition-opacity" />
  
      <span className="text-sm text-white/70 group-hover:hidden">{count}</span>
    </div>
  );
}
