
import { motion } from "framer-motion";
import { User, Lock, History } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileHeaderProps {
  defaultTab: string;
}

export const ProfileHeader = ({ defaultTab }: ProfileHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-mental-800 mb-6">Mon profil</h1>
      
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique diagnostics
          </TabsTrigger>
        </TabsList>
        
        {/* TabsContent is provided by parent component */}
      </Tabs>
    </motion.div>
  );
};
