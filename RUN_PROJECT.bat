@echo off
title SensorPulse - Smart Campus Launcher
echo ====================================================
echo Starting SensorPulse IoT Telemetry Application...
echo ====================================================

:: Find Java
set "JAVA_EXE=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot\bin\java.exe"
if not exist "%JAVA_EXE%" (
    where java >nul 2>&1
    if %errorlevel% equ 0 (
        set "JAVA_EXE=java"
    ) else (
        echo [ERROR] Java 21 was not found. Please verify OpenJDK installation.
        pause
        exit /b 1
    )
)

echo [1/2] Starting Spring Boot Backend on http://localhost:8080 ...
start "SensorPulse Backend (Port 8080)" /min cmd /c "cd /d "%~dp0smart campus 2\backend" && "%JAVA_EXE%" -jar target\sensor-simulator-backend-1.0.0.jar"

echo [2/2] Starting Frontend Web Server on http://localhost:5173 ...
start "SensorPulse Frontend (Port 5173)" /min cmd /c "cd /d "%~dp0smart campus 3\frontend\frontend\frontend" && npx --yes serve -s dist -l 5173"

echo Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening browser to http://localhost:5173 ...
start http://localhost:5173

echo ====================================================
echo Application is now live!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8080/api
echo H2 Console: http://localhost:8080/h2-console
echo ====================================================
