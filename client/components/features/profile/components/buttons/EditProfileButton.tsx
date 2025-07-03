import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { saveLastFocusedElement } from "@/utils/utils";

export const EditProfileButton = ({ username }: { username: string }) => {
  return (
    <Link
      href={`/${username}/edit/profile/general`}
      onClick={saveLastFocusedElement}
      className={buttonVariants({ variant: "outline" })}
    >
      Modifier le résumé
    </Link>
  );
};
