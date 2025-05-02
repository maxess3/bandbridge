import Image from "next/image";

export const ProfilePicture = ({ src, alt }: { src: string; alt: string }) => {
	return (
		<div className="w-56 h-56 flex rounded-full overflow-hidden">
			<Image
				width={300}
				height={300}
				src={src}
				alt={alt}
				className="object-cover h-full shadow-xl"
			/>
		</div>
	);
};
