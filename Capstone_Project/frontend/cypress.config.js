const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // We've set the base URL, so we can use relative paths in `cy.visit()`
    baseUrl: 'http://localhost:5173',
    
    // Optional: A good default setting to prevent tests from failing
    // if the page loads a bit slower.
    defaultCommandTimeout: 5000,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
