@echo off
echo Attempting to resolve Git sync issue...
git pull --rebase origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Pull failed. This might be due to conflicts.
    echo Please resolve them manually or ask me to help with specific files.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo Pull successful! Now pushing changes...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Push failed. 
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [SUCCESS] Repository is now in sync!
pause
