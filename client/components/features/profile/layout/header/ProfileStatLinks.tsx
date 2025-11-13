import Link from "next/link";

interface StatLinkProps {
  href: string;
  count: number;
  label: string;
}

const ProfileStatLink = ({ href, count, label }: StatLinkProps) => (
  <Link href={href} className="group relative">
    <span className="flex items-end gap-x-1.5">
      <span className="font-bold">{count}</span>
      <span className="opacity-80 font-medium"> {label}</span>
    </span>
    <span className="absolute bottom-1 left-0 w-full h-px bg-current opacity-0 group-hover:opacity-80"></span>
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
    <div className="flex gap-x-4">
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
