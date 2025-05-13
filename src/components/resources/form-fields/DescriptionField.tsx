
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const DescriptionField = ({ value, onChange }: DescriptionFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description courte *</Label>
      <Textarea
        id="description"
        name="description"
        placeholder="Brève description de la ressource"
        rows={3}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};
