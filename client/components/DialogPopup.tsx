"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/Combobox";
import { MultiSelect } from "@/components/MultiSelect";

export function DialogPopup() {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([
    "guitarist",
  ]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent w-full">
          Modifier le profil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <div>
              <h2 className="text-xl">Modifier le profil</h2>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[600px] h-auto overflow-y-scroll p-6 space-y-10">
          <div className="space-y-3">
            <h4 className="font-semibold text-2xl">Informations de base</h4>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="opacity-80">
                Prénom
              </Label>
              <Input id="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="opacity-80">
                Nom d'utilisateur
              </Label>
              <Input type="text" id="username" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="opacity-80">
                Email
              </Label>
              <Input type="email" id="email" className="opacity-80" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="birthdate" className="opacity-80">
                Date de naissance
              </Label>
              <Input type="date" id="birthdate" className="opacity-80" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city" className="opacity-80">
                Ville
              </Label>
              <Combobox />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-2xl">Recherche</h4>
            <div className="space-y-1.5">
              <Label htmlFor="name">Type de recherche</Label>
              <Combobox />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Profils recherchés</Label>
              <MultiSelect
                onValueChange={setSelectedProfiles}
                defaultValue={selectedProfiles}
                placeholder="Selectionner les profiles"
                options={[{ value: "guitarist", label: "Guitariste" }]}
              />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-2xl">Profil</h4>
            <div className="space-y-1.5">
              <Label htmlFor="name">Type de profil</Label>
              <Combobox />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Instruments pratiqués</Label>
              <MultiSelect
                onValueChange={setSelectedProfiles}
                defaultValue={selectedProfiles}
                placeholder="Selectionner les profiles"
                options={[{ value: "guitarist", label: "Guitariste" }]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Styles favoris</Label>
              <MultiSelect
                onValueChange={setSelectedProfiles}
                defaultValue={selectedProfiles}
                placeholder="Selectionner les profiles"
                options={[{ value: "guitarist", label: "Guitariste" }]}
              />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-2xl">Liens</h4>
            <div className="space-y-1.5">
              <Label htmlFor="name">Youtube</Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Instagram</Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">SoundCloud</Label>
              <Input id="name" className="col-span-3" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" variant="primary">
            Enregister
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
