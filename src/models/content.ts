
export interface Section {
  id: string;
  title: string;
  content: string;
  updatedAt: string | Date; // Make updatedAt required to match ContentSection in store
}

export interface InfoPage {
  id: string;
  title: string;
  slug: string;
  sections: Section[];
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId?: string; // Add userId property
}
