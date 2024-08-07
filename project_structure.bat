@echo off

 
 
mkdir src\components src\services src\utils
type nul > src\App.js

 
mkdir public
 
mkdir tests
 
(
echo # Node modules
echo node_modules/
echo.
echo # Build directory
echo build/
echo.
echo # Environment variables
echo .env
echo.
echo # IDE files
echo .vscode/
echo .idea/
echo.
echo # OS generated files
echo .DS_Store
echo Thumbs.db
) > .gitignore
 
(
echo # O*NET Career Explorer
echo.
echo This project is a tool for exploring career information using the O*NET database.
echo.
echo ## Setup
echo.
echo 1. Clone the repository
echo 2. Run `npm install` to install dependencies
echo 3. Run `npm start` to start the development server
echo.
echo ## Features
echo.
echo - Search for occupations
echo - View detailed occupation information
echo - Generate Work Breakdown Structures ^(WBS^)
echo.
echo ## Technologies Used
echo.
echo - React
echo - O*NET Web Services API
) > README.md
 
call npm init -y

 
call npm install react react-dom axios

echo Project structure created successfully!