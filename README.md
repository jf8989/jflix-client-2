# J-Flix Angular Client (J-Flix 2.0) 🎬

This project is the Angular-based frontend client for the j-Flix application. It allows users to browse movies, manage their profiles, and keep track of their favorite films.

This application interacts with the [j-Flix API](<Your API Repo URL - Add Link Here>) for data and authentication.

## Live Demo ✨

View the deployed application on Vercel: [https://j-flix-angular-client-alpha.vercel.app/](https://jflix-client-2.vercel.app/welcome)

## Features 🚀

*   **User Authentication:** Secure user registration and login forms.
*   **Movie Browsing:** Displays a list of movies fetched from the API in responsive cards.
*   **Detailed Views:** Provides dialog popups for:
    *   Movie Synopsis
    *   Genre Details
    *   Director Details (Name, Bio, etc.)
*   **Favorites Management:** Allows users to add or remove movies from their personal favorites list. Favorite status is persisted via the API and reflected visually.
*   **User Profile:** Dedicated view for users to see and update their profile information (Email, Birthday, Password). Option to deregister the account.
*   **Responsive Design:** Built with Angular Material to ensure usability across different screen sizes (mobile-first approach).
*   **Routing:** Utilizes Angular Router for navigation between Welcome, Movies, and Profile views.

## Technical Stack 🛠️

*   **Framework:** Angular (v19+) with Standalone Components
*   **Language:** TypeScript
*   **UI Library:** Angular Material
*   **State Management:** RxJS (for handling asynchronous operations), localStorage (for token/user persistence)
*   **HTTP Client:** Angular `HttpClient` for API communication
*   **Code Documentation:** TypeDoc
*   **Build Tool:** Angular CLI

## Backend API Connection 🔌

This frontend application consumes the j-Flix REST API hosted at:
`https://j-flix-omega.vercel.app`

## Getting Started 🔧

**Prerequisites:**

*   Node.js and npm (Check versions using `node -v` and `npm -v`)
*   Angular CLI (`npm install -g @angular/cli`)

**Installation & Running Locally:**

1.  **Clone the repository:**
    ```bash
    git clone <your-angular-repo-url>
    cd J-Flix-Angular-client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    ng serve --open
    ```
    Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

*(Ensure the backend API is running and accessible for the application to function correctly).*

## Building for Production 📦

To create an optimized production build:

```bash
ng build

The build artifacts will be stored in the `dist/j-flix-angular-client` directory.

## Running Unit Tests 🧪

To execute the unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test
```

*(Note: End-to-end tests are not configured in this project setup).*

## Code Documentation (TypeDoc) 📚

Detailed documentation for the Angular components, services, and methods has been generated using TypeDoc.

**To view the documentation:**

1.  Ensure you have run `npm install` to install dev dependencies (including `typedoc`).
2.  Generate the documentation (if not already present):
    ```bash
    npx typedoc src/app --out docs/typedoc --entryPointStrategy expand
    ```
3.  Open the generated `docs/typedoc/index.html` file in your web browser.

## Deployment ☁️

This application is automatically deployed to Vercel upon pushes to the main branch.

## License 📄

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE.md](LICENSE.md) file for details.

## Author 👨‍💻

**Juan Francisco Marcenaro A.** - Full Stack Developer in training