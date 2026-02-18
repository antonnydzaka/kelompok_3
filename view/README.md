# FreshFruit AI - Frontend

This is the React frontend for FreshFruit AI, replacing the legacy HTML files.

## Getting Started

1.  **Install Dependencies:**
    (Already installed)
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## Project Structure

-   `src/pages/`: Contains the page components (Home, AddFood).
-   `src/components/`: Reusable components (Navbar).
-   `legacy_html/`: Backup of the original HTML files.

## Note on Backend Integration

The existing Go backend (`main.go`) was serving static HTML files from `view/`. Since these files have been moved to `legacy_html/` and the frontend is now a React app, the backend routes need to be updated to either:
1.  Serve the built React files from `view/dist/` (after running `npm run build`).
2.  Or act as an API server while you run the frontend separately via `npm run dev`.
