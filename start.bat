where npm.exe >nul 2>nul
IF ERRORLEVEL 0 (
    set DEBUG=fintechfinalproject:* & npm start
)
where yarn.exe >nul 2>nul
IF ERRORLEVEL 0 (
    set DEBUG=fintechfinalproject:* & yarn start
)
@echo please install npm or yarn.
