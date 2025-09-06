import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactItem from "./ContactItem";

export default function ContactCard({ title, contacts }) {
  return (
    <Card className="bg-black/40 text-white rounded-2xl border border-white/10">
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
