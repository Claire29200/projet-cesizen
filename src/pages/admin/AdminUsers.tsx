
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit, Check, X } from "lucide-react";

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin',
    email: 'brestoise6@gmail.com',
    isAdmin: true,
    isActive: true,
    dateCreated: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Utilisateur Test',
    email: 'user@example.com',
    isAdmin: false,
    isActive: true,
    dateCreated: '2023-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Jean Dupont',
    email: 'jean@example.com',
    isAdmin: false,
    isActive: true,
    dateCreated: '2023-02-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Marie Martin',
    email: 'marie@example.com',
    isAdmin: false,
    isActive: false,
    dateCreated: '2023-03-05T00:00:00Z',
  },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const { toast } = useToast();
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: newUserData.name,
      email: newUserData.email,
      isAdmin: newUserData.isAdmin,
      isActive: true,
      dateCreated: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    setIsAddUserDialogOpen(false);
    setNewUserData({
      name: "",
      email: "",
      password: "",
      isAdmin: false,
    });
    
    toast({
      title: "Succès",
      description: "L'utilisateur a été ajouté avec succès.",
    });
  };
  
  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? selectedUser : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "Succès",
      description: "L'utilisateur a été mis à jour avec succès.",
    });
  };
  
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    
    setUsers(updatedUsers);
    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "Succès",
      description: "L'utilisateur a été supprimé avec succès.",
    });
  };
  
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    
    setUsers(updatedUsers);
    
    toast({
      title: "Statut mis à jour",
      description: "Le statut de l'utilisateur a été mis à jour avec succès.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar />
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-mental-800 mb-2">
                      Gestion des utilisateurs
                    </h1>
                    <p className="text-mental-600">
                      Gérez les utilisateurs de la plateforme
                    </p>
                  </div>
                  <Button
                    className="mt-4 sm:mt-0"
                    onClick={() => setIsAddUserDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un utilisateur
                  </Button>
                </div>
                
                <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mental-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
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
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
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
                                  onClick={() => toggleUserStatus(user.id)}
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
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsEditUserDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsDeleteUserDialogOpen(true);
                                    }}
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
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte utilisateur pour la plateforme.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Nom de l'utilisateur"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mot de passe"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="admin"
                checked={newUserData.isAdmin}
                onCheckedChange={(checked) => setNewUserData({ ...newUserData, isAdmin: checked })}
              />
              <Label htmlFor="admin">Administrateur</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddUser}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-admin"
                  checked={selectedUser.isAdmin}
                  onCheckedChange={(checked) =>
                    setSelectedUser({ ...selectedUser, isAdmin: checked })
                  }
                />
                <Label htmlFor="edit-admin">Administrateur</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={selectedUser.isActive}
                  onCheckedChange={(checked) =>
                    setSelectedUser({ ...selectedUser, isActive: checked })
                  }
                />
                <Label htmlFor="edit-active">Actif</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateUser}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="text-mental-800">
                Vous êtes sur le point de supprimer l'utilisateur <span className="font-medium">{selectedUser.name}</span> ({selectedUser.email}).
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
