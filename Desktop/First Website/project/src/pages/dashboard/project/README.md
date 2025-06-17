# HomeAway Student Accommodation Platform

This project is a web application designed for homeowners to manage their property listings for student accommodation. Homeowners can add, edit, and view their listings, as well as track inquiries and messages from potential tenants.

## Features

- **User Authentication**: Secure login for homeowners to access their dashboard.
- **Dashboard**: Overview of the homeowner's listings, including statistics and recent activity.
- **Add Listing**: A form for homeowners to add new property listings with details such as title, description, price, and images.
- **Manage Listings**: Homeowners can view and edit their existing listings.
- **Messaging**: A feature to communicate with students interested in the properties.
- **Analytics**: Insights into listing performance, including views and saves.

## Project Structure

```
project
├── src
│   ├── components        # Reusable UI components
│   ├── contexts          # Context API for state management
│   ├── lib               # Utility functions and mock data
│   ├── pages             # Application pages
│   │   ├── dashboard     # Dashboard related components
│   │   │   ├── HomeownerDashboardPage.tsx  # Homeowner dashboard
│   │   │   └── AddListingPage.tsx          # Add new listing form
│   │   ├── login        # Login page
│   └── types             # TypeScript types
├── package.json          # NPM configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd project
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

Visit `http://localhost:3000` in your browser to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.