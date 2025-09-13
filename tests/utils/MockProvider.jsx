import React from "react";
import { useAppContext } from "../../src/context/AppContext.jsx";
import { vi } from "vitest";

export const MockProvider = ({ children, value = {} }) => {
  useAppContext.mockReturnValue({
    leads: [],
    opportunities: [],
    selectedLead: null,
    isLoading: false,
    error: null,
    filters: { search: "", status: "all", sortBy: "score", sortOrder: "desc" },
    updateLead: vi.fn(),
    addOpportunity: vi.fn(),
    convertLeadToOpportunity: vi.fn(),
    setSelectedLead: vi.fn(),
    setFilters: vi.fn(),
    clearError: vi.fn(),
    ...value, // permite sobrescrever valores por teste
  });

  return <>{children}</>;
};