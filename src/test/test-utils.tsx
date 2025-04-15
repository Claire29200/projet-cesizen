
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InfoPage } from '@/models/content';

// Mock InfoPage factory function to help with creating test data
export const createMockInfoPage = (overrides: Partial<InfoPage> = {}): InfoPage => {
  return {
    id: `mock-page-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Test Page',
    slug: 'test-page',
    isPublished: true,
    sections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: overrides.userId, // Optional user ID
    ...overrides
  };
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
