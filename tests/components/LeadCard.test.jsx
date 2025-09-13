import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LeadCard from '../../src/components/leads/LeadCard.jsx';
import { useAppContext } from '../../src/context/AppContext.jsx';

// Mock the context
vi.mock('../../src/context/AppContext.jsx', () => ({
    useAppContext: vi.fn()
}));

// Mock the helpers
vi.mock('../../src/utils/helpers.js', () => ({
    getStatusColor: vi.fn(() => 'bg-blue-100 text-blue-800'),
    validateEmail: vi.fn(() => true)
}));

const mockLead = {
    id: '1',
    name: 'Elizabeth Bennet',
    company: 'Pride and Prejudice Ltd',
    email: 'elizabeth@prideandprejudice.com',
    source: 'Website',
    score: 95,
    status: 'new'
};

describe('LeadCard Component', () => {
    const mockUpdateLead = vi.fn();
    const mockSetSelectedLead = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAppContext.mockReturnValue({
            updateLead: mockUpdateLead,
            setSelectedLead: mockSetSelectedLead,
        });
    });

    const defaultProps = {
        lead: mockLead,
        isEditing: false,
        onEdit: vi.fn(),
        onCancelEdit: vi.fn(),
        onSave: vi.fn(),
    };

    // Positive Tests
    describe('Positive Tests', () => {
        it('should render lead information correctly', () => {
            render(<LeadCard {...defaultProps} />);

            expect(screen.getByText('Elizabeth Bennet')).toBeInTheDocument();
            expect(screen.getByText('Pride and Prejudice Ltd')).toBeInTheDocument();
            expect(screen.getByText('elizabeth@prideandprejudice.com')).toBeInTheDocument();
            expect(screen.getByText('Source: Website')).toBeInTheDocument();
            expect(screen.getByText('Score: 95')).toBeInTheDocument();
            expect(screen.getByText('new')).toBeInTheDocument();
        });

        it('should enter edit mode when Edit button is clicked', () => {
            const onEdit = vi.fn();
            render(<LeadCard {...defaultProps} onEdit={onEdit} />);

            fireEvent.click(screen.getByText('Edit'));
            expect(onEdit).toHaveBeenCalled();
        });

        it('should show edit form when in editing mode', () => {
            render(<LeadCard {...defaultProps} isEditing={true} />);

            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Status')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });

        it('should save changes with valid email', async () => {
            const onSave = vi.fn();
            render(<LeadCard {...defaultProps} isEditing={true} onSave={onSave} />);

            const emailInput = screen.getByLabelText('Email');
            fireEvent.change(emailInput, { target: { value: 'newemail@test.com' } });
            fireEvent.click(screen.getByText('Save'));

            await waitFor(() => {
                expect(mockUpdateLead).toHaveBeenCalledWith('1', {
                    status: 'new',
                    email: 'newemail@test.com'
                });
                expect(onSave).toHaveBeenCalled();
            });
        });

        it('should cancel editing and reset form', () => {
            const onCancelEdit = vi.fn();
            render(<LeadCard {...defaultProps} isEditing={true} onCancelEdit={onCancelEdit} />);

            const emailInput = screen.getByLabelText('Email');
            fireEvent.change(emailInput, { target: { value: 'changed@test.com' } });
            fireEvent.click(screen.getByText('Cancel'));

            expect(onCancelEdit).toHaveBeenCalled();
        });

        it('should select lead when card is clicked', () => {
            render(<LeadCard {...defaultProps} />);

            fireEvent.click(screen.getByText('Elizabeth Bennet').closest('div[class*="bg-white"]'));
            expect(mockSetSelectedLead).toHaveBeenCalledWith(mockLead);
        });

        it('should update status correctly', async () => {
            const onSave = vi.fn();
            render(<LeadCard {...defaultProps} isEditing={true} onSave={onSave} />);

            const statusSelect = screen.getByLabelText('Status');
            fireEvent.change(statusSelect, { target: { value: 'contacted' } });
            fireEvent.click(screen.getByText('Save'));

            await waitFor(() => {
                expect(mockUpdateLead).toHaveBeenCalledWith('1', {
                    status: 'contacted',
                    email: 'elizabeth@prideandprejudice.com'
                });
            });
        });
    });

    // Negative Tests
    describe('Negative Tests', () => {
        it('should show error for invalid email format', async () => {
            // Mock validateEmail to return false for invalid email
            const { validateEmail } = await import('../../src/utils/helpers.js');
            validateEmail.mockReturnValue(false);

            render(<LeadCard {...defaultProps} isEditing={true} />);

            const emailInput = screen.getByLabelText('Email');
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.click(screen.getByText('Save'));

            await waitFor(() => {
                expect(screen.getByText('Invalid email')).toBeInTheDocument();
                expect(mockUpdateLead).not.toHaveBeenCalled();
            });
        });

        it('should not save with empty email', async () => {
            // Mock validateEmail to return false for empty email
            const { validateEmail } = await import('../../src/utils/helpers.js');
            validateEmail.mockReturnValue(false);

            render(<LeadCard {...defaultProps} isEditing={true} />);

            const emailInput = screen.getByLabelText('Email');
            fireEvent.change(emailInput, { target: { value: '' } });
            fireEvent.click(screen.getByText('Save'));

            await waitFor(() => {
                expect(screen.getByText('Invalid email')).toBeInTheDocument();
                expect(mockUpdateLead).not.toHaveBeenCalled();
            });
        });

        it('should not select lead when in editing mode', () => {
            render(<LeadCard {...defaultProps} isEditing={true} />);

            fireEvent.click(screen.getByLabelText('Email').closest('div[class*="bg-white"]'));
            expect(mockSetSelectedLead).not.toHaveBeenCalled();
        });

        it('should prevent event propagation on button clicks', () => {
            const onEdit = vi.fn();
            render(<LeadCard {...defaultProps} onEdit={onEdit} />);

            // Click the edit button - should not trigger card selection
            fireEvent.click(screen.getByText('Edit'));
            expect(onEdit).toHaveBeenCalled();
            expect(mockSetSelectedLead).not.toHaveBeenCalled();
        });

        it('should handle missing lead data gracefully', () => {
            const incompleteLead = {
                id: '1',
                name: 'Test Lead',
                company: '',
                email: 'test@example.com',
                source: '',
                score: null,
                status: 'new'
            };

            render(<LeadCard {...defaultProps} lead={incompleteLead} />);

            expect(screen.getByText('Test Lead')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
        });
    });
});