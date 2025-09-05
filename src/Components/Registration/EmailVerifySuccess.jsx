import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function EmailVerifySuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <Card className="bg-neutral-900 text-white w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">Email verified</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">
            Your email has been successfully verified. <br />
            You can log in with your account now.
          </p>
          <Button className="mt-4 w-full" onClick={() => navigate("/sign-in")}>
            Back to log in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
