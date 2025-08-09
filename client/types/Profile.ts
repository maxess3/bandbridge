export interface SocialLinks {
	youtube?: string;
	instagram?: string;
	tiktok?: string;
	twitter?: string;
	soundcloud?: string;
}

export interface LastFollowers {
	city: string;
	firstName: string;
	followersCount: number;
	username: string;
}

export interface Profile {
	userId: string;
	description: string;
	firstName: string;
	lastName: string;
	username: string;
	birthDate: string;
	gender: "MALE" | "FEMALE" | "OTHER";
	country: string;
	zipCode: string;
	profilePictureKey: string;
	role: "MUSICIAN" | string;
	city: string;
	concertsPlayed:
		| "NOT_SPECIFIED"
		| "LESS_THAN_10"
		| "TEN_TO_FIFTY"
		| "FIFTY_TO_HUNDRED"
		| "MORE_THAN_HUNDRED";
	rehearsalsPerWeek:
		| "NOT_SPECIFIED"
		| "ONCE_PER_WEEK"
		| "TWO_TO_THREE_PER_WEEK"
		| "MORE_THAN_THREE_PER_WEEK";
	practiceType: "NOT_SPECIFIED" | "HOBBY" | "ACTIVE";
	socialLinks: SocialLinks;
	followers: number;
	following: number;
	lastFollowers: LastFollowers[];
	instruments: {
		instrumentTypeId: string;
		level: string | null;
		order: number;
		instrumentType: {
			name: string;
			profession: string | null;
		};
	}[];
	genres: string[];
	styles: string[];
	lastSeen: string;
	createdAt?: string;
}
