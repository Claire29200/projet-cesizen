
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Check, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  dateCreated: string;
}

interface UsersTableProps {
  users: User[];
  onToggleStatus: (userId: string) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const UsersTable = ({
  users,
  onToggleStatus,
  onEditUser,
  onDeleteUser,
}: UsersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <span className="bg-mental-100 text-mental-800 text-xs px-2 py-1 rounded-full">
                      Administrateur
                    </span>
                  ) : (
                    <span className="bg-mental-50 text-mental-600 text-xs px-2 py-1 rounded-full">
                      Utilisateur
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onToggleStatus(user.id)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Actif
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Inactif
                      </>
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  {new Date(user.dateCreated).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
