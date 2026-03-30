@echo off
title CipoBolt Projekt Indito
cls

echo ==========================================
echo    CipoBolt Rendszer Inditasa...
echo ==========================================

echo.
echo 1. Backend API szerver inditasa...

cd /d "%~dp0Backend\Pz_Vcs"
echo [Backend] Fuggetlensegek ellenorzese...
call npm install --legacy-peer-deps
start "CipoBolt Backend" cmd /k "npm start"

echo.
echo 2. Web Frontend inditasa...

cd /d "%~dp0frontend"
echo [Frontend] Fuggetlensegek ellenorzese...
call npm install --legacy-peer-deps

start "CipoBolt Frontend" cmd /k "npm run dev"

echo.
echo 3. Admin Kliens (WPF) inditasa...

cd /d "%~dp0WPF\szovalwpf\bin\Debug\net8.0-windows"
if exist "CipoBoltAdmin.exe" (
    start "" "CipoBoltAdmin.exe"
    echo [WPF] Admin kliens elindult.
) else (
    echo [HIBA] Az Admin kliens .exe nem talalhato az utvonalon!
)

echo.
echo ==========================================
echo Minden modul inditasa megtortent.
echo ==========================================
echo.

exit