"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";
import { IoMdTime } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { RiUserSearchLine } from "react-icons/ri";
import { CiMusicNote1 } from "react-icons/ci";
import { TbCrown } from "react-icons/tb";
import { CgSearch } from "react-icons/cg";
import { SlPencil } from "react-icons/sl";

export default function RootPage() {
  return (
    <div className="py-8 flex flex-col w-full">
      <div className="w-full flex gap-x-4">
        <div className="w-9/12">
          <div className="flex gap-x-8 w-full">
            <div className="flex items-center">
              <div className="w-56 h-56 flex rounded-full overflow-hidden border border-secondary shadow-lg">
                <Image
                  width={300}
                  height={300}
                  src="/profile.jpeg"
                  alt="Photo de profil"
                  className="object-cover h-full shadow-xl"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold inline-flex items-center">
                    Maxime
                  </span>
                  <span className="text-lg relative -top-1">@maxess</span>
                </div>
                <div>
                  <Link href="/me/edit/profile/general">
                    <Button variant="outline" icon={<SlPencil />}>
                      Modifier mon profil
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="inline-flex items-center py-4 gap-x-2">
                <div className="flex w-full items-center gap-x-2.5">
                  <span className="bg-muted-background rounded-full w-10 h-10 inline-flex justify-center items-center">
                    <CgSearch className="text-primary" size="1.4em" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold">Recherche un groupe</span>
                    <span className="text-sm opacity-90">
                      Guitariste, Bassiste, Batteur
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-x-16 opacity-90">
                <div className="space-y-1.5">
                  <span className="text-sm">L'essentiel :</span>
                  <ul className="text-base space-y-1 flex flex-col">
                    <li className="inline-flex items-center gap-x-2">
                      <RiUserSearchLine size={"1.2em"} /> Musicien
                    </li>
                    <li className="inline-flex items-center gap-x-2">
                      <TbCrown size={"1.2em"} />
                      Guitare, Piano
                    </li>
                    <li className="inline-flex items-center gap-x-2">
                      <CiMusicNote1 size={"1.2em"} />
                      Rock, Jazz, Hip-Hop
                    </li>
                  </ul>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm">À propos :</span>
                  <ul className="text-base space-y-1 flex flex-col">
                    <li className="inline-flex items-center gap-x-2">
                      <HiOutlineLocationMarker size={"1.2em"} /> Toulouse (31)
                    </li>
                    <li className="inline-flex items-center gap-x-2">
                      <AiOutlineUser size={"1.1em"} /> 25 ans
                    </li>
                    <li className="inline-flex items-center gap-x-2">
                      <IoMdTime size={"1.2em"} /> Connecté(e) il y a 1h
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-10">
            <div className="w-full flex gap-4">
              <div className="w-full">
                <div className="space-y-8 bg-background border border-secondary rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="text-xl">
                      <h2 className="font-semibold">Instruments pratiqués</h2>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="text-sm border px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                        Guitare
                      </span>
                      <span className="text-sm border px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                        Piano
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xl">
                      <h2 className="font-semibold">
                        Expérience de l'instrument
                      </h2>
                    </div>
                    <div className="flex flex-wrap">
                      <ul>
                        <li>Guitare: 3ans</li>
                        <li>Guitare: 3ans</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xl">
                      <h2 className="font-semibold">Influences</h2>
                    </div>
                    <div className="flex flex-wrap">
                      <ul>
                        <li>Jimi hendrix</li>
                        <li>Red Hot Chili Peppers</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xl">
                      <h2 className="font-semibold">Styles</h2>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="text-sm border px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                        Rock
                      </span>
                      <span className="text-sm border px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                        Jazz
                      </span>
                      <span className="text-sm border px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                        Electro
                      </span>
                      <span className="text-sm border px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                        Metal
                      </span>
                      <span className="text-sm border px-3 py-0.5 font-semibold rounded-full mr-2 mb-2">
                        Hip-Hop
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xl">
                      <h2 className="font-semibold">Matériel</h2>
                    </div>
                    <div className="flex flex-wrap">
                      <ul>
                        <li>Guitare: 3ans</li>
                        <li>Guitare: 3ans</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/12 bg-muted p-4 rounded-lg space-y-6">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Maxime</span>
            <span className="text-sm opacity-80">@maxess</span>
          </div>
          <div>
            <div className="text-sm space-y-3 border-t border-secondary py-3">
              <span className="text-sm">Liens</span>
              <ul className="space-y-2">
                <li className="flex items-center hover:underline">
                  <AiOutlineYoutube
                    size="1.65em"
                    className="inline-flex mr-1.5"
                  />
                  Youtube
                </li>
                <li className="flex items-center hover:underline">
                  <FaInstagram size="1.5em" className="inline-flex mr-2" />
                  Instagram
                </li>
                <li className="flex items-center hover:underline">
                  <RiSoundcloudFill
                    size="1.6em"
                    className="inline-flex mr-1.5"
                  />
                  Soundcloud
                </li>
              </ul>
              <Link href="/me/edit/profile/social" className="flex">
                <Button variant="linkForm">Ajouter un lien</Button>
              </Link>
            </div>
            <div className="text-sm space-y-3 border-t border-secondary py-3">
              <span className="text-sm">Groupe</span>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-9 h-9 bg-muted-background rounded-sm"></span>
                  <span>Les incorruptibles</span>
                </li>
              </ul>
              <Link href="/me/edit/profileBand" className="flex">
                <Button variant="linkForm">Ajouter un groupe</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
