import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LeadsList from '../../src/components/leads/LeadsList.jsx';
import { useAppContext } from '../../src/context/AppContext.jsx';
import { MockProvider } from '../utils/MockProvider.jsx';

// Mock the useAppContext hook
vi.mock('../../src/context/AppContext.jsx', () => ({
  useAppContext: vi.fn()
}));

// Mock the child components
vi.mock('../../src/components/leads/LeadCard.jsx', () => ({
  default: ({ lead }) => <div data-testid="lead-card">{lead.name}</div>
}));

vi.mock('../../src/components/leads/LeadFilters.jsx', () => ({
  default: () => <div data-testid="lead-filters">Filters</div>
}));

const mockLeads = [
  {
    id: '1',
    name: 'Elizabeth Bennet',
    company: 'Pride and Prejudice Ltd',
    email: 'elizabeth@prideandprejudice.com',
    source: 'Website',
    score: 95,
    status: 'new'
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy',
    company: 'Pride and Prejudice Ltd',
    email: 'darcy@prideandprejudice.com',
    source: 'Referral',
    score: 92,
    status: 'contacted'
  }
];

describe('LeadsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Positive Tests
  describe('Positive Tests', () => {
    it('should render leads when data is loaded', async () => {
      useAppContext.mockReturnValue({
        leads: mockLeads,
        isLoading: false,
        error: null,
        filters: { search: '', status: 'all', sortBy: 'score', sortOrder: 'desc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      expect(await screen.findByText('Elizabeth Bennet')).toBeInTheDocument();
      expect(screen.getByText('Fitzwilliam Darcy')).toBeInTheDocument();
    });

    it('should filter leads by search term', async () => {
      useAppContext.mockReturnValue({
        leads: mockLeads,
        isLoading: false,
        error: null,
        filters: { search: 'Elizabeth', status: 'all', sortBy: 'score', sortOrder: 'desc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      expect(await screen.findByText('Elizabeth Bennet')).toBeInTheDocument();
      expect(screen.queryByText('Fitzwilliam Darcy')).not.toBeInTheDocument();
    });

    it('should filter leads by status', () => {
      useAppContext.mockReturnValue({
        leads: mockLeads,
        isLoading: false,
        error: null,
        filters: { search: '', status: 'contacted', sortBy: 'score', sortOrder: 'desc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      expect(screen.queryByText('Elizabeth Bennet')).not.toBeInTheDocument();
      expect(screen.getByText('Fitzwilliam Darcy')).toBeInTheDocument();
    });

    it('should sort leads correctly', async () => {
      useAppContext.mockReturnValue({
        leads: mockLeads,
        isLoading: false,
        error: null,
        filters: { search: '', status: 'all', sortBy: 'name', sortOrder: 'asc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      const leadElements = await screen.findAllByText(/Bennet|Darcy/);
      expect(leadElements[0]).toHaveTextContent('Elizabeth Bennet');
      expect(leadElements[1]).toHaveTextContent('Fitzwilliam Darcy');
    });
  });

  // Negative Tests
  describe('Negative Tests', () => {
    it('should show loading state', () => {
      useAppContext.mockReturnValue({
        leads: [],
        isLoading: true,
        error: null,
        filters: { search: '', status: 'all', sortBy: 'score', sortOrder: 'desc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should show error state', () => {
      useAppContext.mockReturnValue({
        leads: [],
        isLoading: false,
        error: 'Failed to load leads',
        filters: { search: '', status: 'all', sortBy: 'score', sortOrder: 'desc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      const errorElements = screen.getAllByText('Failed to load leads');
      expect(errorElements).toHaveLength(2);
    });

    it('should show empty state when no leads match filters', () => {
      useAppContext.mockReturnValue({
        leads: mockLeads,
        isLoading: false,
        error: null,
        filters: { search: 'NonExistentLead', status: 'all', sortBy: 'score', sortOrder: 'desc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      expect(screen.getByText('No lead found')).toBeInTheDocument();
      expect(screen.getByText('Please, try to adjust the search filter')).toBeInTheDocument();
    });

    it('should show empty state when no leads exist', () => {
      useAppContext.mockReturnValue({
        leads: [],
        isLoading: false,
        error: null,
        filters: { search: '', status: 'all', sortBy: 'score', sortOrder: 'desc' },
        setFilters: vi.fn()
      });

      render(<LeadsList />);

      expect(screen.getByText('No lead found')).toBeInTheDocument();
      expect(screen.getByText('There is no registered leads yet')).toBeInTheDocument();
    });
  });
});