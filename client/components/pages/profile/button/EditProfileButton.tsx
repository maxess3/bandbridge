import { Pencil } from "lucide-react";
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
      <Pencil className="mr-1" style={{ width: "1.15em", height: "1.15em" }} />
      Modifier mon profil
    </Link>
  );
};
