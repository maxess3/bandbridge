import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
        <Button variant="outline" className="bg-transparent">
          Éditer mon profil
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[600px]"
      >
        <DialogHeader>
          <DialogTitle>Profil</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Prénom
            </Label>
            <Input id="name" value="" className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nom d'utilisateur
            </Label>
            <Input
              id="username"
              value="@peduarte"
              className="col-span-3"
              readOnly
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
