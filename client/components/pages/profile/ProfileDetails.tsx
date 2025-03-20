import {
  getAgeFromTimestamp,
  capitalizeFirstLetterOnly,
  translateProfileRole,
} from "@/utils/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoMdTime } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { RiUserSearchLine } from "react-icons/ri";
import { CiMusicNote1 } from "react-icons/ci";
import { TbCrown } from "react-icons/tb";

interface ProfileDetailsProps {
  profile: {
    role: string;
    instruments: string[];
    styles: string[];
    city: string;
    zipCode: string;
    birthDate: string;
    lastSeen: string;
  };
}

type InfoItem = {
  icon: JSX.Element;
  text: string;
};

type InfoListProps = {
  title: string;
  items: InfoItem[];
};

const InfoList: React.FC<InfoListProps> = ({ title, items }) => (
  <div className="space-y-1.5">
    <span className="text-sm">{title}</span>
    <ul className="text-base space-y-1 flex flex-col">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center gap-x-2">
          {item.icon} {item.text}
        </li>
      ))}
    </ul>
  </div>
);

export const ProfileDetails = ({ profile }: ProfileDetailsProps) => (
  <div className="mt-2 flex gap-x-16 opacity-90">
    <InfoList
      title="L'essentiel :"
      items={[
        {
          icon: <RiUserSearchLine size={"1.2em"} />,
          text:
            profile?.role &&
            capitalizeFirstLetterOnly(translateProfileRole(profile?.role)),
        },
        {
          icon: <TbCrown size={"1.2em"} />,
          text: profile?.instruments?.join(", "),
        },
        {
          icon: <CiMusicNote1 size={"1.2em"} />,
          text: profile?.styles?.join(", "),
        },
      ]}
    />
    <InfoList
      title="À propos :"
      items={[
        {
          icon: <HiOutlineLocationMarker size={"1.2em"} />,
          text: profile?.city + ` (${profile?.zipCode?.slice(0, 2)})`,
        },
        {
          icon: <AiOutlineUser size={"1.1em"} />,
          text: `${getAgeFromTimestamp(profile?.birthDate)} ans`,
        },
        {
          icon: <IoMdTime size={"1.2em"} />,
          text: `Connecté(e) il y a ${profile?.lastSeen}`,
        },
      ]}
    />
  </div>
);
