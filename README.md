# Vue.js 3 Anime Search App
This app allows users to search for anime using the AniList API. The app provides two search modes:

- Standard Search - returns a list of anime matching the search query
- Single Search - returns a single anime matching the search query

## Installation

- Clone this repository with the command: 

```bash
git clone https://github.com/iaco32/search-anime.git
```

- Navigate into the project directory: 
```bash
cd search-anime
```
- Install dependencies with the command: 
```bash
npm install
```

- Run the development server with the command: 
```bash
npm run serve
```
- Run unit tests with the command:
```bash
npm run test
```
# Usage
- Open the app in your web browser: http://localhost:5173
- Enter an anime title in the search box (e.g: Naruto)
- Choose search mode: Standard Search or Single Search
- Click the "Search" button
- Results will be displayed on the screen
- If you choose "Standard Search" you will see a list of results with one or more titles based on the name entered.
- If you choose "Single Search" you will see only one result
- If you do not enter anything and click on the "Search" button (or you get an error from the server), you will see an error message

# Technical Details
This app was built with the following tools and technologies:

- Vue.js 3 with Composition API and script setup
- TypeScript
- CSS styles
- AniList API
## API Documentation
- https://anilist.gitbook.io/anilist-apiv2-docs/
- GraphiQL explorer: https://anilist.co/graphiql
- Interactive documentation: https://anilist.github.io/ApiV2-GraphQL-Docs/

# Credits
This app was created by Donato Iacoviello.