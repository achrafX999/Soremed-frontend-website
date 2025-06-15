// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // l’URL racine de Vite en dev, sans /api
    baseUrl: "http://localhost:5173/",
  },
});
