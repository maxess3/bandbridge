export const ProfileStats = ({
	followers,
	following,
}: {
	followers: number;
	following: number;
}) => {
	return (
		<div className="flex gap-x-6">
			<div>
				<span className="font-black">{followers}</span>
				<span className="opacity-80"> Abonnés</span>
			</div>
			<div>
				<span className="font-black">{following}</span>
				<span className="opacity-80"> Suivi(e)s</span>
			</div>
		</div>
	);
};
