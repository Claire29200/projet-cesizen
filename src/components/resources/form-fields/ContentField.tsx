
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContentFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ContentField = ({ value, onChange }: ContentFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Contenu détaillé</Label>
      <Textarea
        id="content"
        name="content"
        placeholder="Instructions détaillées, conseils et informations supplémentaires..."
        rows={6}
        value={value}
        onChange={onChange}
      />
      <p className="text-xs text-mental-500">
        Vous pouvez utiliser du texte simple ou du Markdown pour le formatage
      </p>
    </div>
  );
};
