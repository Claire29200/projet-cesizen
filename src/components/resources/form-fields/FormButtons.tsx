
import { Button } from "@/components/ui/button";

interface FormButtonsProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const FormButtons = ({ isEditing, onCancel }: FormButtonsProps) => {
  return (
    <div className="pt-4 flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit">
        {isEditing ? "Mettre à jour" : "Créer"}
      </Button>
    </div>
  );
};
