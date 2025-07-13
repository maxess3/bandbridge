import { getAgeFromTimestamp } from "@/utils/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { Profile } from "@/types/Profile";

type InfoItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

const InfoItem = ({ icon, children }: InfoItemProps) => (
  <li className="inline-flex items-center gap-x-1">
    {icon}
    {children}
  </li>
);

export const ProfileBasicInfo = ({ profile }: { profile: Profile }) => {
  const hasLocation = profile?.city && profile?.zipCode;
  const locationText = hasLocation
    ? `${profile.city}, ${profile.zipCode}`
    : null;

  const ageText = profile?.birthDate
    ? `(${getAgeFromTimestamp(profile.birthDate)} ans)`
    : "";

  return (
    <div>
      <ul className="flex flex-wrap gap-x-4">
        {locationText && (
          <InfoItem
            icon={
              <HiOutlineLocationMarker size="1.2em" className="opacity-80" />
            }
          >
            {locationText}
          </InfoItem>
        )}
        <InfoItem icon={<AiOutlineUser size="1.2em" className="opacity-80" />}>
          {`Musicien ${ageText}`}
        </InfoItem>
      </ul>
    </div>
  );
};
