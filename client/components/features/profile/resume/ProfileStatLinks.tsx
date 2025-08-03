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
}: {
	followers: number;
	following: number;
}) => (
	<div className="flex gap-x-4">
		<ProfileStatLink href={`/followers/`} count={followers} label="Abonnés" />
		<ProfileStatLink href={`/following/`} count={following} label="Suivi(e)s" />
	</div>
);
