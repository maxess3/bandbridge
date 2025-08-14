import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";

interface InfoItemProps {
	icon: React.ReactNode;
	children: React.ReactNode;
}

const InfoItem = ({ icon, children }: InfoItemProps) => (
	<li className="flex items-center gap-2 text-sm text-muted-foreground">
		{icon}
		<span>{children}</span>
	</li>
);

export const ProfileBasicInfo = ({
	city,
	zipCode,
	age,
}: {
	city?: string;
	zipCode?: string;
	age?: number | null;
}) => {
	const hasLocation = city && zipCode;
	const locationText = hasLocation ? `${city}, ${zipCode}` : null;
	const ageText = age ? `(${age} ans)` : "";

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
