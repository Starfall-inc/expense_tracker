# Minimalist Expense Tracker (INR)

A sleek, professional, and minimalist expense tracking application built with Node.js, Express, and SQLite. Features real-time analytics, secure authentication, and a mobile-first responsive design.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Minimalist+Expense+Tracker+Dashboard)

## 🚀 Features

-   **Minimalist Design**: Ultra-tight UI with a focus on essential data and clean aesthetics.
-   **Multi-View Navigation**: Separate "Overview" (summary & charts) and "History" (full transaction list) pages.
-   **Financial Analytics**: 
    -   Transaction breakdown by category (Doughnut/Bar charts).
    -   Income vs. Expense trends (Daily/Monthly line charts).
-   **Dual-Type Transactions**: Full support for both **Income** and **Expense** tracking.
-   **Secure Auth**: JWT-based authentication with cookie-based session management.
-   **Currency Localization**: Built-in support for **INR (₹)** with Indian number formatting.
-   **Mobile-First**: Fully responsive with a bottom navigation bar for mobile users.
-   **Containerized**: Ready to deploy with Docker and Docker Compose.

## 🛠 Tech Stack

-   **Frontend**: EJS, Tailwind CSS, Alpine.js, Chart.js, Font Awesome.
-   **Backend**: Node.js, Express.js, CORS (* allowed).
-   **Database**: SQLite (`better-sqlite3`).
-   **Auth**: JSON Web Tokens (JWT), `bcryptjs`.
-   **CI/CD**: Docker, Docker Compose.

## 📦 Setup & Installation

### 1. Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/expense-tracker.git
    cd expense-tracker
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment**:
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    JWT_SECRET=your_super_secret_key
    DATABASE_PATH=./db/expense_tracker.db
    ```

4.  **Start the app**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000`.

### 2. Using Docker (Recommended)

1.  **Build and run**:
    ```bash
    docker-compose up --build
    ```

2.  **Access the app**:
    Docker is configured to map to a random available host port (defaulting to `8793:3000` as per latest config). Check the output of `docker ps` to find the exact port.

## 📁 Directory Structure

```text
├── db/             # SQLite connection and schema
├── middleware/     # Auth checks
├── public/         # Static assets
├── routes/         # Express API routes
├── views/          # EJS templates
│   ├── partials/   # Global components (header/footer)
├── Dockerfile      # Container build
├── docker-compose  # Multi-container setup
└── server.js       # App entry point
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
