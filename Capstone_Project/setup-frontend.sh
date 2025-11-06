#!/bin/bash
# This script creates the directory structure for our React frontend.

# Create the root folder
mkdir frontend
cd frontend

# Create package.json
echo '{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}' > package.json

# Create the public directory
mkdir public
echo '<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="RBAC application created with React"
    />
    <title>RBAC App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>' > public/index.html

# Create the src directory and subdirectories
mkdir -p src/components
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/services

# Create empty files
touch src/index.js
touch src/index.css
touch src/App.jsx
touch src/services/api.js
touch src/context/AuthContext.jsx
touch src/hooks/useAuth.js
touch src/components/Header.jsx
touch src/components/LoadingSpinner.jsx
touch src/components/ProtectedRoute.jsx
touch src/components/ContentCard.jsx
touch src/components/ContentForm.jsx
touch src/pages/LoginPage.jsx
touch src/pages/RegisterPage.jsx
touch src/pages/PostsPage.jsx
touch src/pages/MeetingsPage.jsx
touch src/pages/AdminPanel.jsx
touch src/pages/NotFoundPage.jsx

echo "Frontend structure created successfully."
echo "Next steps:"
echo "1. cd frontend"
echo "2. Run 'npm install react-scripts' (if you don't have it globally)"
echo "3. Run 'npm install'"
echo "4. Copy the code from our chat into each new file."
echo "5. Run 'npm start'"
