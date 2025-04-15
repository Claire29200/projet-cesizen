
import { InfoPage } from '@/models/content';
import { createMockInfoPage } from '../test-utils';
import { vi } from 'vitest';

export const mockContentController = {
  getInfoPages: vi.fn().mockReturnValue([]),
  getUserInfoPages: vi.fn((userId?: string) => 
    userId 
      ? [createMockInfoPage({ userId })] 
      : []
  ),
  getPublicInfoPages: vi.fn().mockReturnValue([]),
  getInfoPageBySlug: vi.fn().mockReturnValue(undefined),
  addInfoPage: vi.fn((page: Omit<InfoPage, "id" | "createdAt" | "updatedAt">) => 
    createMockInfoPage(page)
  ),
  updateInfoPage: vi.fn((id: string, updates: Partial<InfoPage>) => 
    createMockInfoPage({ id, ...updates })
  ),
  deleteInfoPage: vi.fn().mockReturnValue(true),
  isPageOwner: vi.fn().mockReturnValue(false)
};
