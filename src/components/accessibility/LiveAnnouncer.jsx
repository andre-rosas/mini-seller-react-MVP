// components/LiveAnnouncer.jsx
import React from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * Live Announcer Component
 * Provides screen reader accessibility for dynamic content changes
 * Uses aria-live region to announce updates without interrupting user flow
 * Hidden visually but accessible to assistive technologies
 */
const LiveAnnouncer = () => {
    const { liveMessage } = useAppContext();

    return (
        <div
            aria-live="polite"      // Announces changes when user is idle
            aria-atomic="true"      // Reads entire content when updated
            className="sr-only"     // Screen reader only - visually hidden
        >
            {liveMessage}
        </div>
    );
};

export default LiveAnnouncer;