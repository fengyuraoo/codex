@echo off
cd /d "%~dp0"
python scripts\run_designmate.py
python scripts\build_static_site.py
echo.
echo Open http://127.0.0.1:8766/ after running start_frontend.bat
pause

