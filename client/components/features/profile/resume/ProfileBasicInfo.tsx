import { getAgeFromTimestamp } from "@/utils/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";

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

export const ProfileBasicInfo = ({
	city,
	zipCode,
	birthDate,
}: {
	city?: string;
	zipCode?: string;
	birthDate?: string;
}) => {
	const hasLocation = city && zipCode;
	const locationText = hasLocation ? `${city}, ${zipCode}` : null;
	const ageText = birthDate ? `(${getAgeFromTimestamp(birthDate)} ans)` : "";

	return (
		<div>
			<ul className="flex flex-wrap gap-x-4">
				{locationText && (
					<InfoItem
						icon={<HiOutlineLocationMarker className="size-5 opacity-80" />}
					>
						{locationText}
					</InfoItem>
				)}
				<InfoItem icon={<AiOutlineUser className="size-5 opacity-80" />}>
					{`Musicien ${ageText}`}
				</InfoItem>
			</ul>
		</div>
	);
};
