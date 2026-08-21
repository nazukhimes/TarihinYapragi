@echo off
chcp 65001 >nul 2>nul
setlocal EnableDelayedExpansion
title Tarih Yapragi
cd /d "%~dp0"

echo.
echo   ============================================
echo     T A R I H   Y A P R A G I
echo     Her gune bir arsiv
echo   ============================================
echo.

rem ---------------------------------------------------------------
rem  1) Node.js var mi?
rem ---------------------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
  echo   [HATA] Node.js bulunamadi.
  echo          Kurulum: https://nodejs.org  ^(LTS surumu^)
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do set "NODE_VER=%%v"
echo   [OK]  Node.js !NODE_VER!

rem ---------------------------------------------------------------
rem  2) Bagimliliklar kurulu mu?
rem ---------------------------------------------------------------
if not exist "node_modules\" (
  echo   [..]  Ilk kurulum yapiliyor, birkac dakika surebilir...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo   [HATA] npm install basarisiz oldu.
    pause
    exit /b 1
  )
  echo.
)
echo   [OK]  Bagimliliklar hazir

rem ---------------------------------------------------------------
rem  3) Calisma modu secimi
rem ---------------------------------------------------------------
echo.
echo   Ne yapmak istiyorsunuz?
echo.
echo     [1]  Gelistirme sunucusu   ^(varsayilan - canli yenileme^)
echo     [2]  Uretim onizlemesi     ^(build + preview^)
echo     [3]  Sadece build al       ^(dist klasoru^)
echo     [4]  Tip kontrolu          ^(typecheck^)
echo.
set "MOD=1"
set /p "MOD=  Seciminiz [1]: "
if "!MOD!"=="" set "MOD=1"
echo.

rem ---------------------------------------------------------------
rem  4) Calistir
rem     Bos portu Vite kendi buluyor (vite.config.ts > strictPort:false)
rem ---------------------------------------------------------------
if "!MOD!"=="4" (
  echo   [..]  TypeScript tip kontrolu calisiyor...
  echo.
  call npm run typecheck
  echo.
  echo   [OK]  Tip kontrolu bitti.
  pause
  exit /b 0
)

if "!MOD!"=="3" (
  echo   [..]  Uretim derlemesi aliniyor...
  echo.
  call npm run build
  if errorlevel 1 (
    echo.
    echo   [HATA] Build basarisiz oldu.
    pause
    exit /b 1
  )
  echo.
  echo   [OK]  Cikti: %~dp0dist
  pause
  exit /b 0
)

if "!MOD!"=="2" (
  echo   [..]  Uretim derlemesi aliniyor...
  echo.
  call npm run build
  if errorlevel 1 (
    echo.
    echo   [HATA] Build basarisiz oldu.
    pause
    exit /b 1
  )
  echo.
  echo   Adres  : Asagida Vite'in yazdigi adres
  echo   Kapatma: Bu pencerede Ctrl+C
  echo.
  call npm run preview -- --open
  goto :son
)

echo   Adres  : Asagida Vite'in yazdigi adres
echo   Kapatma: Bu pencerede Ctrl+C
echo.
call npm run dev -- --open

:son
echo.
echo   Sunucu durdu.
pause
endlocal
