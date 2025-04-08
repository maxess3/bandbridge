import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-y-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-satoshi font-semibold text-foreground">
          La page que vous cherchez n'existe pas.
        </h2>
        <p className="text-foreground/80">
          Veuillez vérifier votre URL ou revenir à la page d’accueil.
        </p>
      </div>
      <Link href="/home" className={buttonVariants({ variant: "primary" })}>
        Retour à l'accueil
      </Link>
    </div>
  );
}
