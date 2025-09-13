import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LeadFilters from '../../src/components/leads/LeadFilters.jsx';
import { useAppContext } from '../../src/context/AppContext.jsx';

// Mock the context
vi.mock('../../src/context/AppContext.jsx', () => ({
    useAppContext: vi.fn()
}));

const mockSetFilters = vi.fn();
const mockFilters = {
    search: '',
    status: 'all',
    sortBy: 'score',
    sortOrder: 'desc'
};

describe('LeadFilters Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAppContext.mockReturnValue({
            filters: mockFilters,
            setFilters: mockSetFilters,
        });
    });

    // Positive Tests
    describe('Positive Tests', () => {
        it('should render all filter inputs', () => {
            render(<LeadFilters />);

            expect(screen.getByPlaceholderText('Name or company...')).toBeInTheDocument();
            expect(screen.getByLabelText('Status')).toBeInTheDocument();
            expect(screen.getByLabelText('Order by')).toBeInTheDocument();
            expect(screen.getByLabelText('Order')).toBeInTheDocument();
        });

        it('should call setFilters when search input changes', () => {
            render(<LeadFilters />);

            const searchInput = screen.getByPlaceholderText('Name or company...');
            fireEvent.change(searchInput, { target: { value: 'Elizabeth' } });

            expect(mockSetFilters).toHaveBeenCalledWith({ search: 'Elizabeth', status: 'all', sortBy: 'score', sortOrder: 'desc' });
        });

        it('should call setFilters when status changes', () => {
            render(<LeadFilters />);

            const statusSelect = screen.getByLabelText('Status');
            fireEvent.change(statusSelect, { target: { value: 'contacted' } });

            expect(mockSetFilters).toHaveBeenCalledWith({
                search: '',
                sortBy: 'score',
                sortOrder: 'desc',
                status: 'contacted'
            });
        });

        it('should call setFilters when sort by changes', () => {
            render(<LeadFilters />);

            const sortBySelect = screen.getByLabelText('Order by');
            fireEvent.change(sortBySelect, { target: { value: 'name' } });

            expect(mockSetFilters).toHaveBeenCalledWith({
                search: '',
                sortBy: 'name',
                sortOrder: 'desc',
                status: 'all'
            });
        });

        it('should call setFilters when sort order changes', () => {
            render(<LeadFilters />);

            const sortOrderSelect = screen.getByLabelText('Order');
            fireEvent.change(sortOrderSelect, { target: { value: 'asc' } });

            expect(mockSetFilters).toHaveBeenCalledWith({
                search: '',
                sortBy: 'score',
                sortOrder: 'asc',
                status: 'all'
            });
        });
    });

    // Negative Tests
    describe('Negative Tests', () => {
        it('should handle empty filter state', () => {
            useAppContext.mockReturnValue({
                filters: {},
                setFilters: mockSetFilters,
            });

            render(<LeadFilters />);

            // Should render without crashing
            expect(screen.getByPlaceholderText('Name or company...')).toBeInTheDocument();
        });

        it('should handle null setFilters function', () => {
            useAppContext.mockReturnValue({
                filters: mockFilters,
                setFilters: null,
            });

            // This should not crash the component
            expect(() => {
                render(<LeadFilters />);
            }).not.toThrow();
        });
    });
});