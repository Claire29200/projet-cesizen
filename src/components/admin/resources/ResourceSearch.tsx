
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { ResourceCategory } from "@/models/resource";

interface ResourceSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCategory: string | null;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  categories: ResourceCategory[];
}

export const ResourceSearch = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}: ResourceSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mental-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher une ressource..."
          className="pl-10"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex-shrink-0 flex items-center">
        <Filter className="h-5 w-5 text-mental-500 mr-2" />
        <select
          className="border rounded py-2 px-3 bg-white"
          value={selectedCategory || ""}
          onChange={onCategoryChange}
        >
          <option value="">Toutes catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
