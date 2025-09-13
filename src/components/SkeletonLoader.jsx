import React from 'react';

/**
 * Skeleton Loading Component
 * Displays animated placeholder cards while content is loading
 * Used to improve perceived performance and user experience
 */

const SkeletonLoader = ({ count = 5 }) => {
    return (
        <div
            className="space-y-4"
            aria-label="Loading leads"
            role="status"
            data-testid="loading-spinner"
        >
            {/* Generate array of skeleton cards based on count prop */}
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="animate-pulse">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">

                                {/* Simulate name and status badges */}
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                                </div>

                                {/* Simulate company name */}
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

                                {/* Simulate email */}
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

                                {/* Simulate source and score info */}
                                <div className="flex items-center space-x-4">
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                                </div>
                            </div>

                            {/* Simulate action button */}
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;