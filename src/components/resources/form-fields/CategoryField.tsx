
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceCategory } from "@/models/resource";

interface CategoryFieldProps {
  value: string;
  categories: ResourceCategory[];
  onChange: (value: string) => void;
}

export const CategoryField = ({ value, categories, onChange }: CategoryFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Catégorie *</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
