@echo off
echo.
echo 1. Backend API szerver inditasa...
cd /d "%~dp0Backend\Pz_Vcs"
call npm install --legacy-peer-deps
start "CipoBolt Backend" cmd /k "npm start"

echo.
echo 2. Web Frontend inditasa...
cd /d "%~dp0frontend"
call npm install --legacy-peer-deps
start "CipoBolt Frontend" cmd /k "npm run dev" echo.

echo 3. Admin Kliens (C#) inditasa...
cd /d "%~dp0WPF\szovalwpf\bin\Debug\net8.0-windows"
start CipoBoltAdmin.exe

echo.

exit