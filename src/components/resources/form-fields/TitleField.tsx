
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TitleFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TitleField = ({ value, onChange }: TitleFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Titre *</Label>
      <Input
        id="title"
        name="title"
        placeholder="Titre de la ressource"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};
