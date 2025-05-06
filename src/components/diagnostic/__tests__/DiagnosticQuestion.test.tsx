import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiagnosticQuestion } from '../DiagnosticQuestion';
import { StressQuestion } from '@/store/diagnostic';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('DiagnosticQuestion', () => {
  const mockQuestion: StressQuestion = {
    id: 'test-1',
    question: 'Do you feel stressed?',
    category: 'emotional',
    points: [0, 1, 2, 3, 4],
    order: 1,
    isActive: true
  };

  it('renders the question text', () => {
    render(
      <DiagnosticQuestion 
        question={mockQuestion} 
        currentAnswer={undefined} 
        onAnswer={() => {}} 
      />
    );
    
    expect(screen.getByText('Do you feel stressed?')).toBeInTheDocument();
  });

  it('renders all answer options', () => {
    render(
      <DiagnosticQuestion 
        question={mockQuestion} 
        currentAnswer={undefined} 
        onAnswer={() => {}} 
      />
    );
    
    expect(screen.getByText('Jamais')).toBeInTheDocument();
    expect(screen.getByText('Rarement')).toBeInTheDocument();
    expect(screen.getByText('Parfois')).toBeInTheDocument();
    expect(screen.getByText('Souvent')).toBeInTheDocument();
    expect(screen.getByText('Très souvent')).toBeInTheDocument();
  });

  it('calls onAnswer with correct value when an option is selected', () => {
    const handleAnswer = vi.fn();
    render(
      <DiagnosticQuestion 
        question={mockQuestion} 
        currentAnswer={undefined} 
        onAnswer={handleAnswer} 
      />
    );
    
    fireEvent.click(screen.getByLabelText('Parfois'));
    expect(handleAnswer).toHaveBeenCalledWith(2);
  });

  it('shows the selected option as checked', () => {
    render(
      <DiagnosticQuestion 
        question={mockQuestion} 
        currentAnswer={3} 
        onAnswer={() => {}} 
      />
    );
    
    const radioSouvent = screen.getByLabelText('Souvent');
    expect(radioSouvent).toBeChecked();
  });
});
