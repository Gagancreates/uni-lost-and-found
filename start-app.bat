@echo off
echo Starting PESU Lost and Found application...
echo.

:: Start the backend server in a new window
start cmd /k "cd backend && npm run dev"

:: Wait a moment for backend to start
timeout /t 5

:: Start the frontend server in a new window
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to close this window. Closing this will NOT stop the servers.
echo You'll need to close the individual terminal windows to stop the servers. 