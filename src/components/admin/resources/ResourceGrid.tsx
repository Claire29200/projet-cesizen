
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Resource } from "@/models/resource";

interface ResourceGridProps {
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

export const ResourceGrid = ({ resources, onEdit, onDelete }: ResourceGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.length > 0 ? (
        resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isAdmin={true}
            onEdit={() => onEdit(resource)}
            onDelete={() => onDelete(resource)}
          />
        ))
      ) : (
        <div className="col-span-full py-8 text-center">
          <p className="text-mental-500">Aucune ressource trouvée</p>
        </div>
      )}
    </div>
  );
};
