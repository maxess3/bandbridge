import { IoIosLink } from "react-icons/io";
import { buttonVariants } from "@/components/ui/button";

interface LinkItemProps {
  platform: string;
  url: string;
}

export const ProfileSocialLink: React.FC<LinkItemProps> = ({
  platform,
  url,
}) => {
  return (
    <li className="flex items-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={
          buttonVariants({ variant: "outline", size: "xs" }) +
          " !rounded-full text-sm"
        }
      >
        <IoIosLink />
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </a>
    </li>
  );
};
