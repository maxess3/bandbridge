"use client";

import Image from "next/image";

import { GoVerified } from "react-icons/go";

import { FaYoutube } from "react-icons/fa";

import { FaInstagram } from "react-icons/fa6";

import { RiSoundcloudFill } from "react-icons/ri";

import { DialogPopup } from "@/components/DialogPopup";

export default function Me() {
  return (
    <div className="mb-40 flex flex-col">
      <div className="flex items-center justify-between w-full h-44 px-6 bg-primary gap-4 relative">
        <div className="w-40 h-40 flex rounded-full overflow-hidden border-4 border-muted-background absolute top-16">
          <Image
            width={300}
            height={300}
            src="/profile.jpeg"
            alt="Photo de profil"
            className="object-cover h-full shadow-xl"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="pt-16 pb-6 px-6 bg-muted-background">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold inline-flex items-center">
              Maxime <GoVerified className="ml-1.5" />
            </span>
            <span className="text-lg relative -top-1">@maxess</span>
            <span className="text-base font-normal mt-2">
              25 ans | Toulouse | Recherche un groupe
            </span>
          </div>
        </div>
        <div className="w-full flex gap-4">
          <div className="w-full">
            <div className="space-y-8 bg-muted-background p-6">
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
                  <h2 className="font-semibold">Expérience de l'instrument</h2>
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

      {/* <div className="w-3/12 min-w-[280px] flex flex-col gap-3">
        <div className="p-6 bg-muted-background">
          <div className="flex flex-col justify-center text-center">
            <div className="flex flex-col items-center">
              <span className="w-36 h-36 flex rounded-full overflow-hidden relative border-2 border-secondary">
                <Image
                  width={300}
                  height={300}
                  src="/profile.jpeg"
                  alt="Photo de profil"
                  className="object-cover h-full shadow-xl"
                />
              </span>
              <div className="flex flex-col mt-3">
                <span className="text-2xl font-semibold">Maxime</span>
                <span>@maxess</span>
              </div>
            </div>
            <div className="mt-4">
              <DialogPopup />
            </div>
          </div>
        </div>
        <div className="bg-muted-background p-6 space-y-5">
          <h3 className="font-semibold text-lg">Liens</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <FaYoutube
                className="mr-2.5"
                style={{ width: "1.5em", height: "1.5em" }}
              />
              YouTube
            </li>
            <li className="flex items-center">
              <RiSoundcloudFill
                className="mr-2.5"
                style={{ width: "1.5em", height: "1.5em" }}
              />
              SoundCloud
            </li>
            <li className="flex items-center">
              <FaInstagram
                className="mr-2.5"
                style={{ width: "1.5em", height: "1.5em" }}
              />
              Instagram
            </li>
          </ul>
        </div>
        <div className="bg-muted-background p-6 space-y-3">
          <h3 className="font-semibold text-lg">Statut</h3>
          <div className="text-base rounded-full flex items-center">
            <span className="w-2.5 h-2.5 bg-[#3cb13c] inline-flex rounded-full mr-2"></span>
            Dans un groupe
          </div>
        </div>
      </div>
      <div className="w-9/12">
        <div className="space-y-8 bg-muted-background p-6">
          <div className="space-y-3">
            <div className="text-xl">
              <h2 className="font-semibold">Instruments</h2>
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
              <h2 className="font-semibold">Expérience de l'instrument</h2>
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
      </div> */}
      {/* <div className="flex justify-between items-center px-8 py-4 bg-muted-background rounded-b-xl">
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
      </div> */}
    </div>
  );
}
