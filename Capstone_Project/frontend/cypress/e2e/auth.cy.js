/// <reference types="cypress" />

describe('Authentication E2E Flow', () => {

  // Before each test, we visit the base URL
  beforeEach(() => {
    // cy.visit() navigates to the 'baseUrl' defined in cypress.config.js
    cy.visit('/');
  });

  it('should successfully log in a Viewer user and see the header', () => {
    // 1. Find the email input field (using its id) and type the viewer's email
    cy.get('#email').type('viewer@example.com');

    // 2. Find the password input field and type the password
    cy.get('#password').type('password123');

    // 3. Find the login button (by its text content) and click it
    cy.contains('button', 'Login').click();

    // 4. Assert: Look for the welcome message in the header
    // This confirms the user is logged in and the UI has updated
    cy.get('.nav-user').should('contain.text', 'Hi, Viewer User (Viewer)');

    // 5. Assert: Check that the "Admin Panel" link is NOT visible
    cy.contains('Admin Panel').should('not.exist');
  });

  it('should show an error for invalid credentials', () => {
    cy.get('#email').type('viewer@example.com');
    cy.get('#password').type('wrongpassword');
    cy.contains('button', 'Login').click();

    // Assert: Check that the error message appears
    cy.get('.form-error').should('contain.text', 'Invalid credentials');
  });

  it('should log the user out successfully', () => {
    // First, log in the user (we can reuse the commands)
    cy.get('#email').type('viewer@example.com');
    cy.get('#password').type('password123');
    cy.contains('button', 'Login').click();

    // Wait for login to complete and header to appear
    cy.get('.nav-user').should('be.visible');

    // Now, find and click the logout button
    cy.contains('button', 'Logout').click();

    // Assert: Check that we are back on the login page
    // We can do this by looking for the "Login" title
    cy.get('.form-title').should('contain.text', 'Login');
  });

});
