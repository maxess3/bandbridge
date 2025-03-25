import Image from "next/image";

export const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="w-64 h-64 flex rounded-full overflow-hidden">
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
