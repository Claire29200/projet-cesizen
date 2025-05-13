
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ActiveToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ActiveToggle = ({ checked, onCheckedChange }: ActiveToggleProps) => {
  return (
    <div className="flex items-center space-x-2 pt-4">
      <Switch
        id="active"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor="active">Activer cette ressource</Label>
      <p className="text-xs text-mental-500 ml-2">
        (Les ressources inactives ne sont pas visibles par les utilisateurs)
      </p>
    </div>
  );
};
