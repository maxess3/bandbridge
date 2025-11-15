import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";

export const LoadingSession = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="flex items-center gap-x-2.5">
        <Image src={Logo} alt="Logo" width={46} height={46} />
        <span className="text-4xl ml-0.5 relative">
          <span className="absolute -top-6 right-0 text-xs font-medium bg-secondary px-1.5 py-1 rounded-md">
            ALPHA
          </span>
          <span className="font-medium">chordeus</span>
        </span>
      </div>
      <div className="w-48 h-1 bg-secondary-hover mt-4 relative">
        <div className="w-1/3 h-1 bg-primary absolute top-0 left-0 animate-loader-animation"></div>
      </div>
    </div>
  );
};
