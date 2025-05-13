
import { useState, useEffect } from "react";
import { InfoPage, Section } from "@/models/content";
import { Resource } from "@/models/resource";
import { ResourceForm } from "./ResourceForm";
import { v4 as uuidv4 } from "uuid";

interface InfoPageResourceAdapterProps {
  infoPage?: InfoPage;
  onSubmit: (infoPage: InfoPage) => void;
  onCancel: () => void;
}

export const InfoPageResourceAdapter = ({
  infoPage,
  onSubmit,
  onCancel
}: InfoPageResourceAdapterProps) => {
  // Convert InfoPage to Resource format for ResourceForm
  const [resourceData, setResourceData] = useState<Partial<Resource>>({
    title: "",
    description: "",
    content: "",
    category: "Informations",
    duration: 10,
    isActive: true,
  });
  
  useEffect(() => {
    if (infoPage) {
      // Map InfoPage data to Resource format
      setResourceData({
        title: infoPage.title,
        description: infoPage.sections[0]?.title || "",
        content: infoPage.sections.map(section => `${section.title}\n\n${section.content}`).join("\n\n---\n\n"),
        category: "Informations",
        isActive: infoPage.isPublished,
      });
    }
  }, [infoPage]);
  
  // Convert Resource format back to InfoPage for submission
  const handleSubmit = (data: Partial<Resource>) => {
    const content = data.content || "";
    const sections: Section[] = [];
    
    // Extract first section as description
    const firstSection: Section = {
      id: infoPage?.sections[0]?.id || uuidv4(),
      title: data.description || "Introduction",
      content: content,
      updatedAt: new Date().toISOString(),
    };
    sections.push(firstSection);
    
    // Create InfoPage data
    const infoPageData: InfoPage = {
      id: infoPage?.id || uuidv4(),
      title: data.title || "Nouvelle ressource",
      slug: infoPage?.slug || data.title?.toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") || "nouvelle-ressource",
      sections: sections,
      isPublished: data.isActive || false,
      createdAt: infoPage?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSubmit(infoPageData);
  };
  
  return (
    <ResourceForm
      resource={resourceData as Resource}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};
