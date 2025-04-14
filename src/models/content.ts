
export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface InfoPage {
  id: string;
  title: string;
  slug: string;
  sections: Section[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
