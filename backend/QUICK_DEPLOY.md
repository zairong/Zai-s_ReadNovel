# 快速部署指南 - Render 專用版本

## 🎨 為什麼選擇 Render？

- ✅ **完全免費** - 免費 Web 服務 + PostgreSQL 資料庫
- ✅ **自動部署** - 連接 GitHub 自動部署
- ✅ **簡單易用** - 圖形化界面，無需 CLI
- ✅ **穩定可靠** - 企業級基礎設施
- ✅ **健康檢查** - 自動監控應用程式狀態

## 🚀 一鍵部署到 Render

### 方法一：使用部署腳本（推薦）

#### Windows 用戶
```bash
# 部署到 Render
deploy.bat deploy

# 檢查部署狀態
set RENDER_APP_URL=https://your-app.onrender.com
deploy.bat check
```

#### Linux/Mac 用戶
```bash
# 部署到 Render
chmod +x deploy.sh
./deploy.sh deploy

# 檢查部署狀態
export RENDER_APP_URL=https://your-app.onrender.com
./deploy.sh check
```

### 方法二：手動部署

#### 1. 準備專案
```bash
# 確保專案在 GitHub 上
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

#### 2. 建立 Render 資料庫
1. 前往 [render.com](https://render.com)
2. 註冊帳號並登入
3. 點擊 "New +" → "PostgreSQL"
4. 設定資料庫名稱：`expressbymysql-db`
5. 選擇免費方案
6. 點擊 "Create Database"
7. 等待資料庫建立完成
8. **複製資料庫連接字串** (稍後會用到)

#### 3. 建立 Web 服務
1. 在 Render 控制台點擊 "New +" → "Web Service"
2. 連接您的 GitHub 倉庫
3. 選擇您的專案倉庫
4. 設定以下參數：
   - **Name**: `expressbymysql-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. 在 "Environment Variables" 中設定：
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `your-database-url` (步驟2的連接字串)
   - `JWT_SECRET` = `your-super-secret-key`
   - `UPLOAD_PATH` = `./uploads`
   - `MAX_FILE_SIZE` = `10485760`
6. 點擊 "Create Web Service"
7. 等待部署完成 (約 5-10 分鐘)

#### 4. 執行資料庫遷移
部署完成後，需要初始化資料庫：

1. 在 Render 控制台找到您的 Web 服務
2. 點擊 "Shell" 按鈕
3. 執行以下命令：
```bash
npm run deploy:init
```

## 🔧 環境變數設定

### 必要的環境變數
```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-key-here
```

### 可選的環境變數
```bash
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🗄️ 資料庫初始化

部署完成後，系統會自動：
1. 建立所有資料表
2. 執行資料庫遷移
3. 建立管理員帳號

### 手動初始化（如果需要）
```bash
# Render
# 在 Render 控制台的 Shell 中執行
npm run deploy:init

# 本地測試
npm run deploy:init
```

## 🧪 測試部署

### 健康檢查
```bash
curl https://your-app-name.onrender.com/api/health
```

### 測試 API 端點
```bash
# 取得所有書籍
curl https://your-app-name.onrender.com/api/books

# 取得 API 資訊
curl https://your-app-name.onrender.com/api/
```

## 🔍 故障排除

### 常見問題

**1. 資料庫連線失敗**
- 檢查 DATABASE_URL 格式
- 確認資料庫服務允許外部連線
- 檢查防火牆設定

**2. 遷移失敗**
- 檢查資料庫權限
- 確認遷移檔案語法正確
- 查看詳細錯誤訊息

**3. 應用程式無法啟動**
- 檢查環境變數設定
- 確認所有依賴已安裝
- 查看應用程式日誌

### 查看日誌

**Render**
在 Render 控制台的 "Logs" 標籤中查看即時日誌

## 📝 部署後檢查清單

- [ ] 應用程式正常啟動
- [ ] 資料庫連線成功
- [ ] 所有 API 端點正常運作
- [ ] 健康檢查通過
- [ ] 管理員帳號已建立
- [ ] 檔案上傳功能正常
- [ ] 前端可以正常連接後端

## 🎉 完成！

您的後端 API 現在已經成功部署到 Render！

**應用程式網址：** `https://your-app-name.onrender.com`

**預設管理員帳號：**
- 帳號：admin
- 密碼：請查看 `init-admin.js` 檔案

**重要提醒：**
1. 立即更改預設密碼
2. 設定適當的 CORS 政策
3. 定期備份資料庫
4. 監控應用程式效能
5. 注意 Render 免費方案的限制（15分鐘無活動後休眠）
