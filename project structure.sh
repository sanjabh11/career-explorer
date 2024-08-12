#!/bin/bash 

 
# Create src directory and its subdirectories
mkdir -p src/{components,services,utils}
touch src/App.js

# Create public directory
mkdir public

# Create tests directory
mkdir tests

# Create .gitignore file
echo "# Node modules
node_modules/

# Build directory
build/

# Environment variables
.env

# IDE files
.vscode/
.idea/

# OS generated files
.DS_Store
Thumbs.db" > .gitignore

# Create README.md file
echo "# O*NET Career Explorer

This project is a tool for exploring career information using the O*NET database.

## Setup

1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the development server

## Features

- Search for occupations
- View detailed occupation information
- Generate Work Breakdown Structures (WBS)

## Technologies Used

- React
- O*NET Web Services API" > README.md

# Initialize npm and create package.json
npm init -y

# Install necessary dependencies
npm install react react-dom axios

echo "Project structure created successfully!"
