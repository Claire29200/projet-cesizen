
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserSearch = ({ value, onChange }: UserSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mental-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Rechercher un utilisateur..."
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
