import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export const GoogleButton = ({ title }: { title: string }) => {
  return (
    <Button
      onClick={() =>
        signIn("google", {
          callbackUrl: "/",
        })
      }
      size="lg"
      variant="outline"
      className="w-full font-medium"
    >
      <FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
      {title}
    </Button>
  );
};
