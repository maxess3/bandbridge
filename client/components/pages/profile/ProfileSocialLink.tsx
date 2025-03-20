import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { RiSoundcloudFill } from "react-icons/ri";

interface LinkItemProps {
  platform: string;
  url: string;
}

const PlatformIcons: Record<string, JSX.Element> = {
  youtube: <AiOutlineYoutube size="1.65em" />,
  instagram: <FaInstagram size="1.5em" />,
  tiktok: <FaTiktok size="1.2em" />,
  twitter: <BsTwitterX size="1.2em" />,
  soundcloud: <RiSoundcloudFill size="1.6em" />,
};

export const ProfileSocialLink: React.FC<LinkItemProps> = ({
  platform,
  url,
}) => {
  return (
    <li className="flex items-center">
      {PlatformIcons[platform]}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1.5"
      >
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </a>
    </li>
  );
};
