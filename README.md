# Pokedex App

![GitHub Pages Workflow Status](https://github.com/rubaka-pl/rss-school/actions/workflows/deploy.yml/badge.svg) ## Table of Contents

* [About The Project](#about-the-project)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Deployment](#deployment)
* [Commit Guidelines](#commit-guidelines)
* [License](#license)
* [Contact](#contact)

## About The Project

This is a React application built with class components that interacts with the PokeAPI to fetch and display Pokémon data. The project emphasizes clean code, strong typing, and robust error handling to provide a smooth user experience.

## Features

* **Search Functionality**: Users can search for Pokémon by name. The application displays Pokémon from the first API page by default or based on the last saved search term.
* **Persistent Search**: The last search query is saved in [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to persist across sessions.
* **Loading Indicators**: A visual spinner is displayed during API requests to provide feedback to the user.
* **API Error Handling**: The application gracefully handles unsuccessful API responses (e.g., 404, 500 errors) and displays informative error messages.
* **Error Boundaries**: Implemented to catch JavaScript errors within the UI, providing a fallback interface and logging error details to the console. A dedicated button is available to trigger an error for demonstration purposes.
* **Pagination**: (If applicable, based on previous discussions about fetching pages, add this here. If you removed it or it's not fully functional, omit it.)
* **Class Components**: The application is structured using React class components, demonstrating proficiency with component lifecycle methods and state management.

## Technologies Used

* [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
* [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
* [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
* [![Husky](https://img.shields.io/badge/Husky-black?style=for-the-badge&logo=husky&logoColor=white)](https://typicode.github.io/husky/)
* [PokeAPI](https://pokeapi.co/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* npm or yarn (Node.js Package Manager)
    ```bash
    npm install npm@latest -g
    # or
    yarn install
    ```

### Installation

1.  Clone the repo
    ```bash
    git clone [https://github.com/rubaka-pl/rss-school.git](https://github.com/rubaka-pl/rss-school.git)
    ```
    (Replace `rubaka-pl` with your GitHub username and `rss-school` with your repository name if it's different)
2.  Navigate into the project directory
    ```bash
    cd rss-school
    ```
3.  Install NPM packages
    ```bash
    npm install
    # or
    yarn install
    ```
4.  Run the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:5173/` (or another port as indicated by Vite).

## Deployment

The project is automatically deployed to GitHub Pages.

1.  Ensure you have `gh-pages` installed:
    ```bash
    npm install --save-dev gh-pages
    # or
    yarn add --dev gh-pages
    ```
2.  Update your `package.json` with the `homepage` URL and deploy scripts:
    ```json
    {
      // ...
      "homepage": "[https://rubaka-pl.github.io/rss-school/](https://rubaka-pl.github.io/rss-school/)", // Your actual GitHub Pages URL
      "scripts": {
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist",
        // ...
      },
      // ...
    }
    ```
3.  Deploy the application:
    ```bash
    npm run deploy
    # or
    yarn deploy
    ```
    The application will be accessible at: [https://rubaka-pl.github.io/rss-school/](https://rubaka-pl.github.io/rss-school/)

## Commit Guidelines

This project adheres to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) specification.
Commit messages must follow the format: `<type>: <description>`.

**Type MUST be lowercase.**

Common types include:

* `init`: Used to start the project/task (e.g., `init: start youtube-task`).
* `feat`: New functionality implemented based on technical specifications (e.g., `feat: add basic page layout`).
* `fix`: A bug fix in previously implemented functionality (e.g., `fix: implement correct loading data from youtube`).
* `refactor`: Changes that do not add new functionality or alter behavior, such as code restructuring or formatting (e.g., `refactor: change structure of the project`).
* `docs`: Changes related to project documentation or README (e.g., `docs: update readme with additional information`).
* `chore`: Project setup, build process, or auxiliary tools changes.

Husky is configured to enforce pre-commit checks, including linting, to maintain code quality before each commit.

## License

Distributed under the MIT License. See `LICENSE` for more information. (If you have a LICENSE file)

## Contact

Your GitHub Profile: [@rubaka-pl](https://github.com/rubaka-pl)
Project Link: [https://github.com/rubaka-pl/rss-school](https://github.com/rubaka-pl/rss-school)
