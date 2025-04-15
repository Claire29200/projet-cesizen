
import { InfoPage } from '@/models/content';
import { createMockInfoPage } from '../test-utils';
import { vi } from 'vitest';

export const mockContentController = {
  getInfoPages: vi.fn<[], InfoPage[]>(() => []),
  getUserInfoPages: vi.fn<[string | undefined], InfoPage[]>((userId) => 
    userId 
      ? [createMockInfoPage({ userId })] 
      : []
  ),
  getPublicInfoPages: vi.fn<[], InfoPage[]>(() => []),
  getInfoPageBySlug: vi.fn<[string], InfoPage | undefined>(() => undefined),
  addInfoPage: vi.fn<[Omit<InfoPage, "id" | "createdAt" | "updatedAt">], InfoPage>((page) => 
    createMockInfoPage(page)
  ),
  updateInfoPage: vi.fn<[string, Partial<InfoPage>], InfoPage>((id, updates) => 
    createMockInfoPage({ id, ...updates })
  ),
  deleteInfoPage: vi.fn<[string], boolean>(() => true),
  isPageOwner: vi.fn<[string], boolean>(() => false)
};
