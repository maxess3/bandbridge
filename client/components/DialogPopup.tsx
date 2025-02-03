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

export function DialogPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent w-full">
          Modifier le profil
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>
            <div>
              <h2 className="text-xl">Modifier le profil</h2>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[600px] h-auto overflow-y-scroll p-6">
          <h4 className="font-semibold text-2xl">Informations de base</h4>
          <div className="space-y-1.5">
            <Label htmlFor="name">Prénom</Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-right">
              Nom d'utilisateur
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Prénom</Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-right">
              Nom d'utilisateur
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Prénom</Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-right">
              Nom d'utilisateur
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Prénom</Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-right">
              Nom d'utilisateur
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Prénom</Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-right">
              Nom d'utilisateur
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Enregister</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
