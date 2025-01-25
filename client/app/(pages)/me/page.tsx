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
    <div className="mb-32 space-y-2">
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
          <div className="flex flex-col space-y-0.5">
            <span className="flex items-center text-2xl font-bold">
              Maxime
              <MdVerified className="ml-1.5 text-[#2563eb]" />
            </span>
            <span className="opacity-90">
              Guitariste recherche un groupe de musique
            </span>
          </div>
        </div>
        <div className="space-x-2">
          <DialogPopup />
        </div>
      </div>
      <div className="bg-muted-background flex flex-col p-8 rounded-xl">
        <div className="grid grid-cols-2 gap-x-8">
          <div className="space-y-2">
            <div className="text-2xl">
              <h2 className="font-semibold">Infos</h2>
            </div>
            <div>
              <p className="opacity-90">
                Musicien passionné, je suis à la recherche d'un groupe de
                musique pour faire quelques jam occasionnellement. Je joue du
                jazz, rock et un peu d'indé ! Musicien passionné, je suis à la
                recherche d'un groupe de musique pour faire quelques jam
                occasionnellement. Je joue du jazz, rock et un peu d'indé !
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">
              <h2 className="font-semibold">Style</h2>
            </div>
            <div className="flex flex-wrap">
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Rock
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Jazz
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Electro
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Metal
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Hip-Hop
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted-background flex flex-col p-8 rounded-xl">
        <div className="grid grid-cols-2 gap-x-8">
          <div className="space-y-2">
            <div className="text-2xl">
              <h2 className="font-semibold">Expérience</h2>
            </div>
            <div>
              <p className="opacity-90">
                Musicien passionné, je suis à la recherche d'un groupe de
                musique pour faire quelques jam occasionnellement. Je joue du
                jazz, rock et un peu d'indé ! Musicien passionné, je suis à la
                recherche d'un groupe de musique pour faire quelques jam
                occasionnellement. Je joue du jazz, rock et un peu d'indé !
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">
              <h2 className="font-semibold">Style</h2>
            </div>
            <div className="flex flex-wrap">
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Rock
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Jazz
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Electro
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Metal
              </span>
              <span className="text-sm bg-secondary px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                Hip-Hop
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
