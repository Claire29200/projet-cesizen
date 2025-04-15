
import { InfoPage } from '@/models/content';
import { createMockInfoPage } from '../test-utils';

export const mockContentController = {
  getInfoPages: jest.fn<InfoPage[], []>(() => []),
  getUserInfoPages: jest.fn<InfoPage[], [string | undefined]>((userId) => 
    userId 
      ? [createMockInfoPage({ userId })] 
      : []
  ),
  getPublicInfoPages: jest.fn<InfoPage[], []>(() => []),
  getInfoPageBySlug: jest.fn<InfoPage | undefined, [string]>(() => undefined),
  addInfoPage: jest.fn<InfoPage, [Omit<InfoPage, "id" | "createdAt" | "updatedAt">]>((page) => 
    createMockInfoPage(page)
  ),
  updateInfoPage: jest.fn<InfoPage, [string, Partial<InfoPage>]>((id, updates) => 
    createMockInfoPage({ id, ...updates })
  ),
  deleteInfoPage: jest.fn<boolean, [string]>(() => true),
  isPageOwner: jest.fn<boolean, [string]>(() => false)
};

