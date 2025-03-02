import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";

export const GoogleButton = () => {
  return (
    <Button
      onClick={() =>
        signIn("google", {
          callbackUrl: "/",
        })
      }
      size="lg"
      variant="outline"
      className="w-full font-semibold bg-card hover:bg-secondary/30"
    >
      <FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
      Se connecter avec Google
    </Button>
  );
};
