"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/general/_partials/button/Radio";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UpdateProfileForm = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h4 className="font-semibold text-2xl">Informations de base</h4>
        <div className="space-y-3">
          <div className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="firstname" className="opacity-80">
                Prénom
              </Label>
              <Input id="firstname" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username" className="opacity-80">
                Nom d'utilisateur
              </Label>
              <Input id="username" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="birthday" className="opacity-80">
                Date de naissance
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Jour"
                  id="birthday"
                  className="w-14"
                  maxLength={2}
                />
                <span className="w-1 flex justify-center">-</span>
                <Select>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="01">Janvier</SelectItem>
                      <SelectItem value="02">Février</SelectItem>
                      <SelectItem value="03">Mars</SelectItem>
                      <SelectItem value="04">Avril</SelectItem>
                      <SelectItem value="mai">Mai</SelectItem>
                      <SelectItem value="juin">Juin</SelectItem>
                      <SelectItem value="juillet">Juillet</SelectItem>
                      <SelectItem value="aout">Aout</SelectItem>
                      <SelectItem value="septembre">Septembre</SelectItem>
                      <SelectItem value="octobre">Octobre</SelectItem>
                      <SelectItem value="novembre">Novembre</SelectItem>
                      <SelectItem value="decembre">Décembre</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <span className="w-1 flex justify-center">-</span>
                <Input
                  placeholder="Année"
                  className="w-20"
                  id="year"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="opacity-80">
                Genre
              </Label>
              <RadioGroup id="gender" className="flex space-x-0.5">
                <Radio title="Homme" id="male" />
                <Radio title="Femme" id="female" />
                <Radio title="Autre" id="other" />
              </RadioGroup>
            </div>
            <div className="space-y-1">
              <Label htmlFor="country" className="opacity-80">
                Pays
              </Label>
              <RadioGroup
                id="gender"
                className="flex space-x-0.5"
                defaultValue="France"
              >
                <Radio title="France" id="france" />
              </RadioGroup>
            </div>
            <div className="space-y-1">
              <Label htmlFor="city" className="opacity-80">
                Ville
              </Label>
              <Input id="city" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="zipcode" className="opacity-80">
                Code Postal
              </Label>
              <Input id="zipcode" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-2xl">Profil musical</h4>
        <div className="space-y-3">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="profile_type" className="opacity-80">
                Type de profil
              </Label>
              <RadioGroup className="flex space-x-0.5">
                <Radio title="Amateur" id="amateur" />
                <Radio title="Professionnel" id="professional" />
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
