import { FaStar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { saveLastFocusedElement } from "@/utils/utils";
import { Pencil } from "lucide-react";

interface Skill {
	name: string;
	isMain?: boolean;
}

interface CategoryProps {
	title: string;
	items: (string | Skill)[];
	isSkill?: boolean;
	className?: string;
}

const Category = ({ title, items, isSkill, className }: CategoryProps) => (
	<div
		className={`flex flex-col px-4 pb-4 pt-2 border-r border-border-extralight w-1/2 last:border-r-0 ${className}`}
	>
		<div className="flex justify-between items-center">
			<div>
				<span className="font-extrabold text-lg">{title}</span>
			</div>
			<div>
				<Link
					href={`/edit/profile/info`}
					onClick={saveLastFocusedElement}
					className="relative group flex justify-center items-center rounded-full w-12 h-12 hover:bg-hover"
				>
					<Pencil
						style={{ width: "1.3em", height: "1.3em" }}
						className="text-foreground/80 group-hover:text-foreground"
					/>
				</Link>
			</div>
		</div>
		<ul className="flex flex-wrap">
			{items.map((item, index) => (
				<li key={index} className="mr-1.5">
					<Badge variant="outline" className="text-sm">
						<span className="flex items-center gap-x-1">
							{typeof item === "string" ? item : item.name}{" "}
							{isSkill && typeof item !== "string" && item.isMain && (
								<FaStar className="text-primary" />
							)}
						</span>
					</Badge>
				</li>
			))}
		</ul>
	</div>
);

export const ProfileMusicInterests = () => {
	const games: Skill[] = [
		{ name: "Guitare", isMain: true },
		{ name: "Piano", isMain: false },
	];

	const musicStyles = ["Rock", "Pop", "Jazz", "Hip-Hop"].map((name) => ({
		name,
	}));

	return (
		<div className="flex border rounded-xl">
			<Category
				title="Instruments"
				items={games}
				isSkill
				className="rounded-tl-xl rounded-bl-xl"
			/>
			<Category
				title="Styles musicaux"
				items={musicStyles}
				className="rounded-tr-xl rounded-br-xl"
			/>
		</div>
	);
};
