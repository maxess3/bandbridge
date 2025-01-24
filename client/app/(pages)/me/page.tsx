"use client";

import Image from "next/image";

import { RiUserHeartLine } from "react-icons/ri";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { BsSuitcase } from "react-icons/bs";
import { MdVerified } from "react-icons/md";

import { DialogPopup } from "@/components/DialogPopup";

export default function Me() {
  return (
    <div className="mb-40 space-y-2">
      <div className="flex justify-between items-center px-8 py-4 bg-muted-background rounded-b-xl">
        <div className="flex items-center space-x-3.5">
          <div>
            <span className="w-32 h-32 flex rounded-full overflow-hidden relative border-2 border-secondary">
              <Image
                width={300}
                height={300}
                src="/profile.jpeg"
                alt="Photo de profil"
                className="object-cover h-full shadow-xl"
              />
            </span>
          </div>
          <div className="flex flex-col">
            {/* <div className="flex space-x-2 text-sm font-bold mt-2">
              <span className="bg-secondary px-2.5 py-0.5 rounded-sm">
                Rock
              </span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-sm">
                Guitariste
              </span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-sm">
                Chanteur
              </span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-sm">+8</span>
            </div> */}
            <span className="flex items-center text-2xl font-bold">
              Bastien
              <MdVerified className="ml-1.5 text-[#2563eb]" />
            </span>
          </div>
        </div>
        <div className="space-x-2">
          <DialogPopup />
          {/* <Button className="bg-[#141b27]" variant={"outline"}>
            Contacter Maxime
          </Button>
          <Button className="bg-[#141b27]" variant={"outline"}>
            Partager le profil
          </Button> */}
        </div>
      </div>
      <div className="bg-muted-background flex flex-col p-8 rounded-xl gap-y-12">
        <div className="flex gap-8">
          <div className="w-1/2 space-y-2">
            <h3 className="text-lg font-semibold inline-flex items-center">
              <AiOutlineUser
                style={{ width: "21px", height: "21px" }}
                className="mr-1.5 relative bottom-0.5"
              />
              À propos
            </h3>
            <p className="opacity-90">
              Musicien passionné, je suis à la recherche d'un groupe de musique
              pour faire quelques jam occasionnellement. Je joue du jazz, rock
              et un peu d'indé !
            </p>
          </div>
          <div className="w-1/2 space-y-2">
            <h3 className="text-lg font-semibold inline-flex items-center">
              <IoMusicalNotesOutline
                style={{ width: "20px", height: "20px" }}
                className="mr-2"
              />
              Style musical
            </h3>
            <div className="flex space-x-2 text-sm font-bold">
              <span className="bg-secondary px-2.5 py-0.5 rounded-sm">
                Rock
              </span>
              <span className="bg-secondary px-2.5 py-0.5 rounded-sm">
                Indé
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="w-1/2 space-y-2">
            <h3 className="text-lg font-semibold inline-flex items-center">
              <BsSuitcase
                style={{ width: "20px", height: "20px" }}
                className="mr-1.5"
              />
              Matériel
            </h3>
            <div className="flex flex-col opacity-90">
              <span>Fender blues deluxe</span>
              <span>fender stratocaster</span>
              <span>Fender blues deluxe</span>
              <span>fender stratocaster</span>
            </div>
          </div>
          <div className="w-1/2 space-y-2">
            <h3 className="text-lg font-semibold inline-flex items-center">
              <RiUserHeartLine
                style={{ width: "20px", height: "20px" }}
                className="mr-2"
              />
              Artistes favoris
            </h3>
            <div className="flex space-x-2 opacity-90">
              FKJ, Jimi Hendrix, Red Hot Chili Peppers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
