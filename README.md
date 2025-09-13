# Mini Seller Console

A lightweight console for lead triage and conversion into opportunities, built with **React** and **Tailwind CSS**. 🚀

---

## 🌟 Features

### 💻 MVP Implemented

- **Leads List**

  - Loads data from a local JSON file.
  - Fields include: id, name, company, email, source, score, and status.
  - Search by name or company.
  - Filter by status.
  - Sort by score (descending).

- **Lead Detail Panel**

  - Click a row to open a slide-over panel.
  - Inline editing for status and email.
  - Email format validation.
  - Save/cancel actions with error handling.

- **Convert to Opportunity**

  - "Convert Lead" button to create an Opportunity.
  - Opportunities include: id, name, stage, amount (optional), and accountName.
  - Opportunities are displayed in a simple table.

- **UX States**
  - Includes loading, empty, and error states.
  - Optimized performance for managing ~100 leads.

### ✨ Nice-to-Haves Implemented

- **Responsive layout** (desktop → mobile).
- **Optimistic updates** with rollback on simulated failure.
- **LocalStorage persistence** for filters.
- **Comprehensive accessibility features**.
- **Complete test suite**.

---

## 🛠️ Technologies

This project uses the following technologies:

- **React (Vite)**
- **Tailwind CSS** for styling
- **React Hook Form** for forms
- **UUID** for unique ID generation
- **Context API** for state management
- **Vitest** for unit and integration testing
- **Jest Axe** for accessibility testing

---

## 📁 Project Structure

```text
.
├── public/
│   ├── leads.json
│   ├── opportunities.json
├── src/
│   ├── components/
│   │   ├── accessibility/
│   │   ├── leads/
│   │   └── opportunities/
│   ├── context/
│   └── utils/
└── tests/
    ├── accessibility/
    ├── components/
    ├── context/
    └── utils/
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser to http://localhost:5173.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run accessibility tests with Lighthouse
npm run test:a11y

# Lint the codebase
npm run lint
```

### Test Examples

```bash
# Run a specific test file
npm run test:run -- tests/components/LeadCard.test.jsx

# Run tests with a UI
npm run test:ui

# Clean the test cache
npm run test:clean
```

### Accessibility Testing

The project includes a comprehensive accessibility test suite. Running `npm run test:a11y` will generate a `lighthouse-a11y.json` report with detailed accessibility metrics.

## 📦 Building for Production

```bash
# Build the project for production
npm run build

# Preview the production build locally
npm run preview
```

## 📜 Available Scripts

| Script                  | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Starts the development server.            |
| `npm run build`         | Builds the app for production.            |
| `npm run preview`       | Previews the production build.            |
| `npm run test:run`      | Runs all tests.                           |
| `npm run test:watch`    | Runs tests in watch mode.                 |
| `npm run test:coverage` | Runs tests with a coverage report.        |
| `npm run test:ui`       | Runs tests with a UI interface.           |
| `npm run test:a11y`     | Runs accessibility tests with Lighthouse. |
| `npm run test:clean`    | Cleans the test cache.                    |
| `npm run lint`          | Lints the codebase using ESLint.          |

## 🎨 Design System

- **Primary Colors**: Blue (#005eb8) and Secondary Blue (#3b82f6)
- **Typography**: Inter (system font)
- **Components**: Cards, Modals, Responsive tables
- **States**: Loading, Empty, Error with distinct SVG icons

## ⚙️ Technical Features

- **Advanced Filters**: Text search, status filtering, and sorting.
- **Validation**: Email format validation using regex and required fields.
- **Performance**: Optimized re-renders using useMemo for filters.
- **Accessibility**: Proper ARIA labels, focus states, and keyboard navigation.
- **Responsiveness**: Adaptive grid layouts and custom breakpoints.

## ♿ Accessibility Features

This application adheres to WCAG 2.1 guidelines, including:

- Screen reader support with live announcements.
- Full keyboard navigation.
- Proper ARIA attributes to enhance semantics.
- High contrast support.
- Respect for reduced motion preferences.
- Comprehensive accessibility testing to maintain standards.

## 📊 Sample Data

The project includes sample data for testing and development:

- `public/leads.json` - A list of sample leads.
- `public/opportunities.json` - A list of sample opportunities.

## 📱 Responsiveness

The application is designed to be responsive across various devices:

- **Mobile**: Single-column layout with stacked cards.
- **Tablet**: Two-column grid with inline filters.
- **Desktop**: Full layout with a dedicated side panel.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes with clear messages.
4. Add tests for any new functionality.
5. Submit a pull request.

## 🐛 Troubleshooting

### Common Issues

- **Tests not running**: Try cleaning the test cache with `npm run test:clean`.
- **Accessibility test fails**: Ensure you've built the project first with `npm run build`.
- **Dependency issues**: Delete the `node_modules` folder and `package-lock.json` file, then run `npm install` again.

### Performance Tips

- The application is optimized for managing around 100 leads.
- Use the built-in filtering and sorting features to efficiently manage large datasets.
- The detail panel uses a slide-over design to help you maintain context while triaging leads.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## ❓ Support

For questions or issues, please review the troubleshooting section above or create a new issue in the project repository.
