"use client";

import Image from "next/image";

import { HiOutlineLocationMarker } from "react-icons/hi";
import { PiIdentificationCardLight } from "react-icons/pi";
import { SlPencil } from "react-icons/sl";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

import apiClient from "@/lib/apiClient";

export default function Me() {
  return (
    <div>
      <div className="bg-slate-700 w-full h-48 relative">
        <span className="w-40 h-40 flex rounded-full absolute -bottom-16 left-6 border-slate-500 border-2 overflow-hidden">
          <Image
            width={300}
            height={300}
            src="/profile.jpeg"
            alt="Photo de profil"
            className="object-cover"
          />
        </span>
        <div className="flex absolute -bottom-10 left-[195px] space-x-4 text-md">
          <div className="flex gap-x-1 items-center opacity-80">
            <HiOutlineLocationMarker className="text-lg" /> Toulouse
          </div>
          <div className="flex gap-x-1.5 items-center opacity-80">
            <PiIdentificationCardLight className="text-xl" /> Inscrit depuis 1
            an
          </div>
        </div>
      </div>
      <div className="flex justify-end pr-6 mt-2">
        <button className="rounded-full w-12 h-12 hover:bg-slate-800 flex items-center justify-center cursor-pointer">
          <SlPencil className="text-xl" />
        </button>
      </div>
      <div>
        <div>
          <div className="flex items-center mt-7 text-2xl font-bold">
            Maxime Schellenberger
          </div>
          <p className="w-7/12 flex opacity-90">
            Guitariste, compositeur, arrangeur, professeur de musique.
          </p>
        </div>
        <div className="font-medium space-y-3 mt-8">
          <div className="text-xl">Mes réseaux</div>
          <div className="flex opacity-80">
            <div className="flex gap-x-5">
              <FaXTwitter className="text-xl" />
              <FaInstagram className="text-xl" />
              <FaFacebookF className="text-lg" />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <Button
            onClick={() =>
              apiClient.get("/user/me/").then((res) => console.log(res.data))
            }
            variant={"outline"}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
}
