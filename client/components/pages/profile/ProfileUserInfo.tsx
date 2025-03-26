import { useProfileContext } from "@/context/ProfileContext";
import { getAgeFromTimestamp } from "@/utils/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";

export const ProfileUserInfo = () => {
  const { isPublic, profile } = useProfileContext();

  return (
    <div>
      <ul className="flex flex-wrap gap-x-6">
        <li className="inline-flex items-center gap-x-1">
          <HiOutlineLocationMarker size={"1.2em"} className="opacity-80" />
          {profile?.city}, {profile?.department} {profile?.zipCode}
        </li>
        <li className="inline-flex items-center gap-x-1">
          <AiOutlineUser size={"1.2em"} className="opacity-80" /> Musicien (
          {getAgeFromTimestamp(profile?.birthdate)} ans)
        </li>
      </ul>
    </div>
  );
};
