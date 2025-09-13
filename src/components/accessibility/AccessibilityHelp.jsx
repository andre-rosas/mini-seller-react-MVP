import React from 'react';

/**
 * Accessibility Help Component
 * Static informational page about accessibility features
 * Provides guidance on keyboard navigation and assistive technology support
 * Serves as a reference for users with disabilities
 */
const AccessibilityHelp = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">

            {/* Main page heading */}
            <h1 className="text-2xl font-bold mb-6">Accessibility</h1>

            {/* Introduction section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">How to use this application</h2>
                <p className="mb-4">
                    This application was developed to be accessible to all users,
                    including those who use assistive technologies.
                </p>
            </section>

            {/* Keyboard navigation instructions */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Keyboard navigation</h2>
                <ul className="list-disc pl-6">
                    <li>Use <kbd>Tab</kbd> to navigate between interactive elements</li>
                    <li>Use <kbd>Enter</kbd> or <kbd>Space</kbd> to activate buttons</li>
                    <li>Use <kbd>Esc</kbd> to close modals and panels</li>
                    <li>Use arrow keys to navigate dropdown menus</li>
                </ul>
            </section>

            {/* Accessibility features overview */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Accessibility features</h2>
                <ul className="list-disc pl-6">
                    <li>Full screen reader support</li>
                    <li>Adequate contrast for users with low vision</li>
                    <li>Simplified keyboard navigation</li>
                    <li>Announcement of dynamic content changes</li>
                </ul>
            </section>

            {/* Contact information for accessibility support */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Need help?</h2>
                <p>
                    If you're having difficulty using this application, contact
                    us at: accessibility@company.com
                </p>
            </section>
        </div>
    );
};

export default AccessibilityHelp;