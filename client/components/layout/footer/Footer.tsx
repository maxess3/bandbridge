"use client";

import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";
import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

function Footer() {
  const axiosAuth = useAxiosAuth();
  const fetchPost = async () => {
    const res = await axiosAuth.get("/user");
    console.log(res.data);
  };
  return (
    <footer className="bg-transparent p-6">
      <div className="flex justify-center">
        <div className="w-full">
          <div className="flex justify-between w-full border-b pb-6 text-sm">
            <div>
              <div className="flex flex-col gap-y-4">
                <Image src={Logo} alt="Readyband Logo" width={36} height={36} />
                <h2 className="text-2xl">
                  <span className="font-medium font-newKansas">
                    La musique qui nous rassemble.
                  </span>
                </h2>
                <p>
                  <span className="font-mediu text-base">Chordeus</span>, 2025.
                </p>
              </div>
            </div>
            <div className="flex gap-x-12">
              <div className="space-y-6">
                <h2 className="text-sm opacity-90">Rejoindre un groupe</h2>
                <ul className="space-y-3">
                  <li>
                    <Link href={"/"}>Groupes sur Paris</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Groupes sur Lyon</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Groupes sur Marseille</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Groupes sur Toulouse</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <h2 className="text-sm opacity-80">Entreprise</h2>
                <ul className="space-y-3">
                  <li>
                    <Link href={"/"}>Blog</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Carrière</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Tarif</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <h2 className="text-sm opacity-90">Légal</h2>
                <ul className="space-y-3">
                  <li>
                    <Link href={"/"}>Politique de confidentialité</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Mentions légales</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-6 flex justify-between items-center">
            <div>
              © 2025{" "}
              <span className="font-semibold font-newKansas">🇫🇷 Chordeus</span>.
              Tous droits réservés.
            </div>
            <div className="flex space-x-6 items-center">
              <Button onClick={fetchPost} variant="outline" size="md">
                Signaler un bug
              </Button>
              <div className="flex space-x-2 justify-center items-center">
                <Link
                  href={""}
                  className={
                    buttonVariants({ variant: "ghost" }) +
                    " w-10 h-10 !rounded-full"
                  }
                >
                  <FaXTwitter style={{ width: "1.4em", height: "1.4em" }} />
                </Link>
                <Link
                  href={""}
                  className={
                    buttonVariants({ variant: "ghost" }) +
                    " w-10 h-10 !rounded-full"
                  }
                >
                  <FaInstagram style={{ width: "1.45em", height: "1.45em" }} />
                </Link>
                <Link
                  href={""}
                  className={
                    buttonVariants({ variant: "ghost" }) +
                    " w-10 h-10 !rounded-full"
                  }
                >
                  <FiFacebook
                    style={{ width: "1.5em", height: "1.5em" }}
                    className="relative right-[2px]"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
