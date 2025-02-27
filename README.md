# Budget Buddy

A modern personal finance management application built with Vue 3, Pinia, and Tailwind CSS.

## Features

- Dashboard with financial overview and expense visualization
- Transaction management with categorization
- Budget planning and tracking
- Category-wise expense breakdown
- Progress tracking for income, expenses, and savings
- Modern and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd budget-buddy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- Vue 3 - Progressive JavaScript Framework
- Vite - Next Generation Frontend Tooling
- Pinia - Vue Store Library
- Vue Router - Official Router for Vue.js
- Tailwind CSS - Utility-first CSS Framework
- Chart.js - Simple yet flexible JavaScript charting
- Vue Chart.js - Vue wrapper for Chart.js

## Project Structure

```
budget-buddy/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Vue components
│   ├── stores/         # Pinia stores
│   ├── views/          # Vue views/pages
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── public/             # Public static assets
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## Usage

1. **Dashboard**: View your financial overview, including total balance, income, and expenses.
2. **Transactions**: Add, edit, and delete transactions with categories.
3. **Budget**: Set and track your budget goals, view progress, and analyze spending patterns.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
