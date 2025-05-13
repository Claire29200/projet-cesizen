
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  dateCreated: string;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUpdateUser: (userData: User) => void;
  onUserDataChange: (userData: User) => void;
}

export const EditUserDialog = ({
  open,
  onOpenChange,
  user,
  onUpdateUser,
  onUserDataChange,
}: EditUserDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom</Label>
            <Input
              id="edit-name"
              value={user.name}
              onChange={(e) => onUserDataChange({ ...user, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={user.email}
              onChange={(e) => onUserDataChange({ ...user, email: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-admin"
              checked={user.isAdmin}
              onCheckedChange={(checked) =>
                onUserDataChange({ ...user, isAdmin: checked })
              }
            />
            <Label htmlFor="edit-admin">Administrateur</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={user.isActive}
              onCheckedChange={(checked) =>
                onUserDataChange({ ...user, isActive: checked })
              }
            />
            <Label htmlFor="edit-active">Actif</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={() => onUpdateUser(user)}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
