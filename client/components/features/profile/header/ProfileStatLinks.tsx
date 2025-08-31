import Link from "next/link";

interface StatLinkProps {
  href: string;
  count: number;
  label: string;
}

const ProfileStatLink = ({ href, count, label }: StatLinkProps) => (
  <Link href={href} className="hover:underline">
    <div className="flex items-end gap-x-1.5">
      <span className="font-bold">{count}</span>
      <span className="opacity-80 font-medium"> {label}</span>
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
    <div className="flex gap-x-6">
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
      <ProfileStatLink
        href={`/${username}/following`}
        count={following}
        label="Vues"
      />
    </div>
  );
};
