@echo off
REM Render 部署腳本 (Windows 版本)
REM 專為 Render 平台優化

echo 🎨 開始部署到 Render...

REM 檢查必要的工具
:check_tool
if "%1"=="" goto :eof
where %1 >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ %1 未安裝，請先安裝 %1
    exit /b 1
)
goto :eof

REM 部署到 Render
:deploy_render
echo 🎨 部署到 Render...

REM 檢查 Git
call :check_tool git
if %errorlevel% neq 0 exit /b 1

REM 檢查是否在 Git 倉庫中
git rev-parse --git-dir >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 請確保在 Git 倉庫中
    exit /b 1
)

REM 推送到 GitHub
echo 📤 推送到 GitHub...
git push origin main

echo ✅ 程式碼已推送到 GitHub！
echo.
echo 🎯 接下來請手動完成以下步驟：
echo 1. 前往 https://render.com
echo 2. 登入您的帳號
echo 3. 建立新的 Web Service
echo 4. 連接您的 GitHub 倉庫
echo 5. 設定環境變數：
echo    - NODE_ENV=production
echo    - DATABASE_URL=your-database-url
echo    - JWT_SECRET=your-secret-key
echo 6. 點擊 'Create Web Service'
echo.
echo 📖 詳細步驟請參考 RENDER_DEPLOYMENT.md
goto :eof

REM 檢查部署狀態
:check_deployment
if "%RENDER_APP_URL%"=="" (
    echo ❌ 請設定 RENDER_APP_URL 環境變數
    exit /b 1
)

echo 🔍 檢查部署狀態...

REM 健康檢查
curl -s "%RENDER_APP_URL%/api/health" >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ 應用程式運行正常
) else (
    echo ❌ 應用程式無法訪問
)

REM API 測試
echo 🧪 測試 API 端點...
curl -s "%RENDER_APP_URL%/api/"
goto :eof

REM 主選單
if "%1"=="deploy" (
    call :deploy_render
) else if "%1"=="check" (
    call :check_deployment
) else (
    echo 使用方法: %0 [deploy^|check]
    echo.
    echo 命令選項:
    echo   deploy - 部署到 Render
    echo   check  - 檢查部署狀態
    echo.
    echo 環境變數設定:
    echo   set RENDER_APP_URL=https://your-app.onrender.com
    echo.
    echo 📖 詳細部署指南請參考 RENDER_DEPLOYMENT.md
    exit /b 1
)
