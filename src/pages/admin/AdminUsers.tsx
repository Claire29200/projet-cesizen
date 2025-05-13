
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  AddUserDialog,
  EditUserDialog,
  DeleteUserDialog,
  UsersTable,
  UserSearch
} from "@/components/admin/users";

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
  const { toast } = useToast();
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddUser = (userData: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }) => {
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: userData.name,
      email: userData.email,
      isAdmin: userData.isAdmin,
      isActive: true,
      dateCreated: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    setIsAddUserDialogOpen(false);
    
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
                    <UserSearch 
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                  </div>
                  
                  <UsersTable 
                    users={filteredUsers}
                    onToggleStatus={toggleUserStatus}
                    onEditUser={(user) => {
                      setSelectedUser(user);
                      setIsEditUserDialogOpen(true);
                    }}
                    onDeleteUser={(user) => {
                      setSelectedUser(user);
                      setIsDeleteUserDialogOpen(true);
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Dialogs */}
      <AddUserDialog 
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onAddUser={handleAddUser}
      />
      
      <EditUserDialog 
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        user={selectedUser}
        onUpdateUser={handleUpdateUser}
        onUserDataChange={setSelectedUser}
      />
      
      <DeleteUserDialog 
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
        user={selectedUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default AdminUsers;
