import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppProvider, useAppContext } from '../../src/context/AppContext';

global.jest = {
    advanceTimersByTime: (ms) => vi.advanceTimersByTime(ms),
};

// Test component to access context
const TestComponent = () => {
    const context = useAppContext();

    return (
        <div>
            <div data-testid="leads-count">{context.leads.length}</div>
            <div data-testid="opportunities-count">{context.opportunities.length}</div>
            <div data-testid="loading">{context.isLoading.toString()}</div>
            <div data-testid="error">{context.error || 'no error'}</div>
            <div data-testid="filters-search">{context.filters.search}</div>
            <div data-testid="filters-status">{context.filters.status}</div>
            <div data-testid="filters-sort">{context.filters.sortBy}</div>
            <button
                data-testid="set-filters"
                onClick={() => context.setFilters({ search: 'test' })}
            >
                Update Search
            </button>
            <button
                data-testid="convert-lead"
                onClick={() => context.convertLeadToOpportunity('1')}
            >
                Convert Lead
            </button>
            <button
                data-testid="update-lead"
                onClick={() => context.updateLead('1', { status: 'qualified' })}
            >
                Update Lead
            </button>
        </div>
    );
};

// Mock leads and opportunities
const mockLeads = [
    { id: '1', name: 'Test Lead', company: 'Test Co', email: 'test@test.com', source: 'Website', score: 85, status: 'new' }
];
const mockOpportunities = [];

describe('AppContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Create fresh localStorage mock
        const localStorageMock = {
            store: {},
            getItem: vi.fn((key) => localStorageMock.store[key] || null),
            setItem: vi.fn((key, value) => {
                localStorageMock.store[key] = value;
            }),
            removeItem: vi.fn((key) => {
                delete localStorageMock.store[key];
            }),
            clear: vi.fn(() => {
                localStorageMock.store = {};
            })
        };

        global.localStorage = localStorageMock;

        // Mock fetch
        global.fetch = vi.fn((url) => {
            if (url.includes('leads.json')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockLeads),
                });
            }
            if (url.includes('opportunities.json')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockOpportunities),
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('provides context values correctly', async () => {
        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('leads-count')).toHaveTextContent('1');
        });

        expect(screen.getByTestId('opportunities-count')).toHaveTextContent('0');
        expect(screen.getByTestId('filters-search')).toHaveTextContent('');
        expect(screen.getByTestId('filters-status')).toHaveTextContent('all');
        expect(screen.getByTestId('filters-sort')).toHaveTextContent('score');
    });

    it('loads filters from localStorage on initialization', async () => {
        localStorage.setItem('seller_console_filters', JSON.stringify({
            search: 'saved search',
            status: 'contacted',
            sortBy: 'name',
            sortOrder: 'asc'
        }));

        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('filters-search')).toHaveTextContent('saved search');
        });
    });

    it('persists filter updates to localStorage', async () => {
        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('leads-count')).toHaveTextContent('1');
        });

        await act(async () => {
            screen.getByTestId('set-filters').click();
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'seller_console_filters',
            expect.any(String)
        );
    });

    it('handles localStorage errors gracefully', async () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        // Mock setItem to throw an error
        localStorage.setItem.mockImplementationOnce(() => {
            throw new Error('Storage full');
        });

        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('leads-count')).toHaveTextContent('1');
        });

        await act(async () => {
            screen.getByTestId('set-filters').click();
        });

        expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to save filters to localStorage:', expect.any(Error));
        consoleWarnSpy.mockRestore();
    });

    it('clears errors automatically after 5 seconds', async () => {
        vi.useFakeTimers();

        // Mock fetch to return error
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        // Wait for error to appear
        await waitFor(() => {
            expect(screen.getByTestId('error')).not.toHaveTextContent('no error');
        });

        // Fast-forward timers
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Check if error was cleared
        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('no error');
        });

        vi.useRealTimers();
    });

    it('handles convert lead to opportunity with optimistic updates', async () => {
        vi.useFakeTimers();

        // Mock Math.random
        const originalRandom = Math.random;
        Math.random = vi.fn(() => 0.9);

        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('leads-count')).toHaveTextContent('1');
        });

        await act(async () => {
            screen.getByTestId('convert-lead').click();
        });

        // Fast-forward timers
        act(() => {
            vi.advanceTimersByTime(1500);
        });

        await waitFor(() => {
            expect(screen.getByTestId('opportunities-count')).toHaveTextContent('1');
        });

        Math.random = originalRandom;
        vi.useRealTimers();
    });

    it('prevents duplicate conversions', async () => {
        vi.useFakeTimers();

        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('leads-count')).toHaveTextContent('1');
        });

        const originalRandom = Math.random;
        Math.random = vi.fn(() => 0.9);

        await act(async () => {
            screen.getByTestId('convert-lead').click();
            vi.advanceTimersByTime(1500);
        });

        await waitFor(() => {
            expect(screen.getByTestId('opportunities-count')).toHaveTextContent('1');
        });

        await act(async () => {
            screen.getByTestId('convert-lead').click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Lead already converted into opportunity');
        });

        Math.random = originalRandom;
        vi.useRealTimers();
    });

    it('handles update lead with rollback on failure', async () => {
        vi.useFakeTimers();

        const originalRandom = Math.random;
        Math.random = vi.fn(() => 0.05);

        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('leads-count')).toHaveTextContent('1');
        });

        await act(async () => {
            screen.getByTestId('update-lead').click();
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Lead upgrade failed');
        });

        Math.random = originalRandom;
        vi.useRealTimers();
    });
});