#!/bin/bash

# Render 部署腳本
# 專為 Render 平台優化

set -e

echo "🎨 開始部署到 Render..."

# 檢查必要的工具
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安裝，請先安裝 $1"
        exit 1
    fi
}

# 部署到 Render
deploy_render() {
    echo "🎨 部署到 Render..."
    
    # 檢查 Git
    check_tool git
    
    # 檢查是否在 Git 倉庫中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ 請確保在 Git 倉庫中"
        exit 1
    fi
    
    # 檢查是否有未提交的變更
    if ! git diff-index --quiet HEAD --; then
        echo "⚠️  檢測到未提交的變更，請先提交："
        echo "   git add ."
        echo "   git commit -m 'Deploy to Render'"
        exit 1
    fi
    
    # 推送到 GitHub
    echo "📤 推送到 GitHub..."
    git push origin main
    
    echo "✅ 程式碼已推送到 GitHub！"
    echo ""
    echo "🎯 接下來請手動完成以下步驟："
    echo "1. 前往 https://render.com"
    echo "2. 登入您的帳號"
    echo "3. 建立新的 Web Service"
    echo "4. 連接您的 GitHub 倉庫"
    echo "5. 設定環境變數："
    echo "   - NODE_ENV=production"
    echo "   - DATABASE_URL=your-database-url"
    echo "   - JWT_SECRET=your-secret-key"
    echo "6. 點擊 'Create Web Service'"
    echo ""
    echo "📖 詳細步驟請參考 RENDER_DEPLOYMENT.md"
}

# 檢查部署狀態
check_deployment() {
    if [ -z "$RENDER_APP_URL" ]; then
        echo "❌ 請設定 RENDER_APP_URL 環境變數"
        exit 1
    fi
    
    echo "🔍 檢查部署狀態..."
    
    # 健康檢查
    if curl -s "$RENDER_APP_URL/api/health" > /dev/null; then
        echo "✅ 應用程式運行正常"
    else
        echo "❌ 應用程式無法訪問"
    fi
    
    # API 測試
    echo "🧪 測試 API 端點..."
    curl -s "$RENDER_APP_URL/api/" | head -20
}

# 主選單
case "${1:-}" in
    "deploy")
        deploy_render
        ;;
    "check")
        check_deployment
        ;;
    *)
        echo "使用方法: $0 [deploy|check]"
        echo ""
        echo "命令選項:"
        echo "  deploy - 部署到 Render"
        echo "  check  - 檢查部署狀態"
        echo ""
        echo "環境變數設定:"
        echo "  export RENDER_APP_URL=https://your-app.onrender.com"
        echo ""
        echo "📖 詳細部署指南請參考 RENDER_DEPLOYMENT.md"
        exit 1
        ;;
esac
