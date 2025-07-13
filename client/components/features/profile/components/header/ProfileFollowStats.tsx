import Link from "next/link";

export const ProfileFollowStats = ({
  followers,
  following,
}: {
  followers: number;
  following: number;
}) => {
  return (
    <div className="flex gap-x-4">
      <Link href={`/followers/`} className="hover:underline">
        <div>
          <span className="font-black">{followers}</span>
          <span className="opacity-80"> Abonnés</span>
        </div>
      </Link>
      <Link href={`/following/`} className="hover:underline">
        <div>
          <span className="font-black">{following}</span>
          <span className="opacity-80"> Suivi(e)s</span>
        </div>
      </Link>
    </div>
  );
};
