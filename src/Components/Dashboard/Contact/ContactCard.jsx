import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactItem from "./ContactItem";
import { useTheme } from "../../Context/ThemeProvider";

export default function ContactCard({ title, contacts }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.9)",
    text: isDark ? "#fff" : "#111",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  };

  return (
    <Card
      className="rounded-2xl"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {contacts.map((c, i) => (
          <ContactItem key={i} {...c} />
        ))}
      </CardContent>
    </Card>
  );
}
