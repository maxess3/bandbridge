import {
  getAgeFromTimestamp,
  capitalizeFirstLetterOnly,
  translateProfileRole,
} from "@/utils/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { RiUserSearchLine } from "react-icons/ri";
import { useProfileContext } from "@/context/ProfileContext";

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
    <ul className="flex space-x-4">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center gap-x-0.5">
          {item.icon} {item.text}
        </li>
      ))}
    </ul>
  </div>
);

export const ProfileDetails = () => {
  const { profile } = useProfileContext();
  return (
    <div className="flex flex-col gap-x-16 opacity-90 border-t border-secondary">
      <InfoList
        title=""
        items={[
          {
            icon: <HiOutlineLocationMarker size={"0em"} />,
            text: (
              <div>
                <span className="font-bold">2000</span>
                <span> Followers</span>
              </div>
            ),
          },
          {
            icon: <HiOutlineLocationMarker size={"0em"} />,
            text: "2000 Suivis",
          },
        ]}
      />
      {/* <InfoList
        title=""
        items={[
          {
            icon: <HiOutlineLocationMarker size={"1.5em"} />,
            text: profile?.city + ` (${profile?.zipCode?.slice(0, 2)})`,
          },
          {
            icon: <RiUserSearchLine size={"1.5em"} />,
            text:
              profile?.role &&
              capitalizeFirstLetterOnly(translateProfileRole(profile?.role)),
          },
          {
            icon: <AiOutlineUser size={"1.5em"} />,
            text: `${getAgeFromTimestamp(profile?.birthDate)} ans`,
          },
        ]}
      /> */}
    </div>
  );
};
