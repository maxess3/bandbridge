import Link from "next/link";

interface StatLinkProps {
	href: string;
	count: number;
	label: string;
}

const ProfileStatLink = ({ href, count, label }: StatLinkProps) => (
	<Link href={href} className="hover:underline">
		<div>
			<span className="font-semibold">{count}</span>
			<span className="opacity-80"> {label}</span>
		</div>
	</Link>
);

export const ProfileStatLinks = ({
	followers,
	following,
	username,
}: {
	followers: number;
	following: number;
	username: string;
}) => {
	return (
		<div className="flex gap-x-4 pt-3">
			<ProfileStatLink
				href={`/${username}/followers`}
				count={followers}
				label="Followers"
			/>
			<ProfileStatLink
				href={`/${username}/following`}
				count={following}
				label="Following"
			/>
		</div>
	);
};
