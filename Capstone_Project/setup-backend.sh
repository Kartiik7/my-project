#!/bin/bash

echo "Creating the RBAC MERN Backend project structure..."

# Create the root directory
mkdir -p backend
cd backend

# 1. Create all sub-directories
echo "Creating directories: config, controllers, middleware, models, routes, utils..."
mkdir -p config
mkdir -p controllers
mkdir -p middleware
mkdir -p models
mkdir -p routes
mkdir -p utils

# 2. Create the main server files
echo "Creating app.js and server.js..."
touch app.js
touch server.js

# 3. Create config files
echo "Creating config/db.js..."
touch config/db.js

# 4. Create controller files
echo "Creating controller files..."
touch controllers/authController.js
touch controllers/postController.js
touch controllers/meetingController.js
touch controllers/adminController.js

# 5. Create middleware file
echo "Creating middleware/authMiddleware.js..."
touch middleware/authMiddleware.js

# 6. Create model files
echo "Creating model files..."
touch models/userModel.js
touch models/postModel.js
touch models/meetingModel.js

# 7. Create route files
echo "Creating route files..."
touch routes/authRoutes.js
touch routes/postRoutes.js
touch routes/meetingRoutes.js
touch routes/adminRoutes.js

# 8. Create utils file
echo "Creating utils/seedDatabase.js..."
touch utils/seedDatabase.js

# 9. Create and pre-fill package.json
echo "Creating package.json..."
cat << EOF > package.json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "MERN RBAC backend server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedDatabase.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF

# 10. Create and pre-fill .env.txt (for you to rename to .env)
echo "Creating .env.txt (please rename to .env)..."
cat << EOF > .env.txt
# Environment Variables
# In production, use real, complex secrets.

PORT=5000
MONGO_URI=mongodb://localhost:27017/rbac-db
JWT_SECRET=your-super-secret-key-123
NODE_ENV=development
EOF

echo "----------------------------------------------------"
echo "Project structure for 'backend' created successfully!"
echo "Next steps:"
echo "1. cd backend"
echo "2. Rename .env.txt to .env"
echo "3. Run 'npm install' to get all dependencies."
echo "4. Copy the JavaScript code from our chat into each of the new .js files."
echo "----------------------------------------------------"

