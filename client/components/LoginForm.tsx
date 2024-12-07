import Link from "next/link";

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
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-host-grotesk font-bold">
          Se connecter
        </CardTitle>
        <CardDescription>
          Entrez votre email et votre mot de passe pour vous connecter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button variant="outline" className="w-full">
            <FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
            Se connecter avec Google
          </Button>
          <span className="my-2 border-b relative before:content-['ou'] before:absolute before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:bg-background before:px-3 before:opacity-90"></span>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@exemple.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Mot de passe oublié?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Vous n'avez pas de compte?{" "}
          <Link href="/signup" className="underline">
            S'inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
