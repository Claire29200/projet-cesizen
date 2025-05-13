
export interface Resource {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  duration?: number;
  isFavorite?: boolean;
  isActive: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description?: string;
}
