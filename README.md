# Pokedex App

![image](https://github.com/user-attachments/assets/40620e59-062d-432b-a155-ee4ba4879f82)

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





