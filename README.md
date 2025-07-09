Project Description (English)
This is a React application developed using class components, leveraging their full lifecycle methods and state management capabilities. The application interacts with the PokeAPI to fetch and display Pokémon data.

Key functionalities and technical aspects include:

Sectional Layout: The application's interface is divided into two main sections. The top section features a search input and a "Search" button, while the bottom section is dedicated to displaying search results as a list of Pokémon cards.

Search Functionality: Users can search for Pokémon. By default, upon page load, it displays Pokémon from the first API page (or based on the last saved search term). Results update dynamically when a new query is entered and the "Search" button is clicked.

Search Term Persistence: The user's last search query is saved in Local Storage to ensure it's available upon subsequent application visits.

Loading Indicator: A loading spinner is displayed during API requests, providing visual feedback to the user about the data fetching process.

API Error Handling: The application is designed to gracefully handle unsuccessful API responses (4xx or 5xx status codes), displaying meaningful error messages to the user.

UI Error Handling with Error Boundaries: The entire application is wrapped in Error Boundaries to catch JavaScript errors occurring within the UI. In case of an error, a fallback UI is rendered, and error information is logged to the console. A dedicated button is provided to trigger an error for demonstration purposes.

TypeScript: The entire project is written in TypeScript, ensuring strong typing, enhancing code readability, and aiding in error prevention during development.

Husky: Husky is configured in the project to enforce pre-commit hooks. This means that code quality checks (such as ESLint) are automatically run before each commit, helping maintain a high standard of code quality and adherence to coding guidelines.

Conventional Commits: Commit messages adhere to the Conventional Commits specification, contributing to a clean and structured version history.
