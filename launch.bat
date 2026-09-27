@echo off
title Graph8 Sidekick Launcher
cd /d "%~dp0"

:: Terminate any stale/hidden background electron processes
taskkill /f /im electron.exe >nul 2>&1

:: Clear any stale locks if app was closed unexpectedly
if exist "%APPDATA%\Graph8Sidekick\SingletonLock" del /f /q "%APPDATA%\Graph8Sidekick\SingletonLock" >nul 2>&1
if exist "%APPDATA%\Graph8Sidekick\lockfile" del /f /q "%APPDATA%\Graph8Sidekick\lockfile" >nul 2>&1

:: Fast launch directly through native electron executable
if exist "%~dp0node_modules\electron\dist\electron.exe" (
    start "" "%~dp0node_modules\electron\dist\electron.exe" "%~dp0."
) else (
    start "" npx electron .
)
exit
