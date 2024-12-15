import { HiOutlineLocationMarker } from "react-icons/hi";
import { PiIdentificationCardLight } from "react-icons/pi";
import { AiFillSafetyCertificate } from "react-icons/ai";

import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div>
      <div className="bg-slate-700 w-full h-48 relative">
        <div className="flex absolute -bottom-10 left-[165px] space-x-6 text-md">
          <div className="flex gap-x-1 items-center opacity-80">
            <HiOutlineLocationMarker className="text-lg" /> Toulouse
          </div>
          <div className="flex gap-x-1.5 items-center opacity-80">
            <PiIdentificationCardLight className="text-xl" /> Inscrit depuis 1
            an
          </div>
        </div>
        <span className="w-32 h-32 flex rounded-full absolute -bottom-16 left-6 border-slate-500 border-2 overflow-hidden">
          <img
            src="./profile.jpeg"
            alt="Photo de profil"
            className="object-cover"
          />
        </span>
      </div>
      <div className="flex items-center mt-20 text-2xl font-bold">
        Maxime Schellenberger{" "}
        <AiFillSafetyCertificate className="text-primary ml-2" />
      </div>
      <p className="w-7/12 flex mt-1 opacity-90">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur
        quibusdam earum explicabo nostrum in quis placeat obcaecati laboriosam
        dignissimos, porro tempore labore laudantium similique expedita cumque,
        recusandae optio consequatur nobis!
      </p>
      <div className="mt-8 mb-52">
        <Button variant={"outline"}>Se déconnecter</Button>
      </div>
    </div>
  );
}
