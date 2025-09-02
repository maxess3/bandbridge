import { FiUser } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";

export const ProfileBasicInfo = ({
  city,
  zipCode,
  age,
  departmentName,
}: {
  city?: string;
  zipCode?: string;
  departmentName?: string | null;
  age?: number | null;
}) => {
  const hasLocation = city && zipCode && departmentName;
  const locationText = `${city}, ${departmentName}, ${zipCode}`;
  const ageText = age ? ` (${age} ans)` : "";

  return (
    <div className="flex flex-col font-medium text-base space-y-2">
      {hasLocation && (
        <span className="flex items-center gap-2 opacity-80">
          <IoLocationOutline className="!size-5" />
          {locationText}
        </span>
      )}
      <span className="flex items-center gap-2 opacity-80">
        <FiUser className="!size-5" />
        Musicien{ageText}
      </span>
    </div>
  );
};
