# 🎨 Render 部署指南

## 🚀 為什麼選擇 Render？

- ✅ **完全免費** - 免費 Web 服務 + PostgreSQL 資料庫
- ✅ **自動部署** - 連接 GitHub 自動部署
- ✅ **簡單易用** - 圖形化界面，無需 CLI
- ✅ **穩定可靠** - 企業級基礎設施
- ✅ **健康檢查** - 自動監控應用程式狀態

## 📋 部署前準備

### 1. 確保專案在 GitHub 上
```bash
# 如果還沒有 Git 倉庫
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. 準備環境變數
您需要準備以下環境變數：
- `NODE_ENV=production`
- `JWT_SECRET=your-super-secret-key`
- `DATABASE_URL` (Render 會自動提供)

## 🎯 部署步驟

### 步驟 1：註冊 Render 帳號
1. 前往 [render.com](https://render.com)
2. 點擊 "Get Started for Free"
3. 使用 GitHub 帳號註冊

### 步驟 2：建立資料庫
1. 在 Render 控制台點擊 "New +"
2. 選擇 "PostgreSQL"
3. 設定資料庫名稱：`expressbymysql-db`
4. 選擇免費方案
5. 點擊 "Create Database"
6. 等待資料庫建立完成
7. **複製資料庫連接字串** (稍後會用到)

### 步驟 3：建立 Web 服務
1. 在 Render 控制台點擊 "New +"
2. 選擇 "Web Service"
3. 連接您的 GitHub 倉庫
4. 選擇您的專案倉庫

### 步驟 4：設定 Web 服務
```
Name: expressbymysql-api
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: (留空)
Build Command: npm install
Start Command: npm start
```

### 步驟 5：設定環境變數
在 "Environment Variables" 區段新增：

```
NODE_ENV = production
DATABASE_URL = postgresql://username:password@host:port/database
JWT_SECRET = your-super-secret-key-here
UPLOAD_PATH = ./uploads
MAX_FILE_SIZE = 10485760
```

**注意：** `DATABASE_URL` 請使用步驟 2 中複製的連接字串

### 步驟 6：部署
1. 點擊 "Create Web Service"
2. 等待部署完成 (約 5-10 分鐘)
3. 部署完成後，您會看到應用程式網址

## 🗄️ 資料庫設定

### PostgreSQL 連接設定
Render 使用 PostgreSQL，但您的專案使用 MySQL。需要修改資料庫配置：

#### 方法 1：修改為 PostgreSQL (推薦)
```bash
# 安裝 PostgreSQL 驅動
npm install pg
```

#### 方法 2：使用外部 MySQL 資料庫
您可以使用以下免費 MySQL 服務：
- **PlanetScale** - 免費 MySQL 資料庫
- **Railway** - 免費 MySQL 資料庫
- **Aiven** - 免費 MySQL 資料庫

## 🔧 部署後設定

### 1. 執行資料庫遷移
部署完成後，需要初始化資料庫：

1. 在 Render 控制台找到您的 Web 服務
2. 點擊 "Shell" 按鈕
3. 執行以下命令：
```bash
npm run deploy:init
```

### 2. 檢查應用程式狀態
1. 在 Render 控制台查看 "Logs" 標籤
2. 確認沒有錯誤訊息
3. 測試健康檢查端點：
```
https://your-app-name.onrender.com/api/health
```

## 🧪 測試部署

### 健康檢查
```bash
curl https://your-app-name.onrender.com/api/health
```

### API 測試
```bash
# 測試 API 資訊
curl https://your-app-name.onrender.com/api/

# 測試書籍 API
curl https://your-app-name.onrender.com/api/books
```

### 管理員登入測試
```bash
curl -X POST https://your-app-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

## 🚨 常見問題

### 1. 部署失敗
**問題：** 建置失敗
**解決：**
- 檢查 `package.json` 中的依賴
- 確認 `start` 腳本正確
- 查看建置日誌

### 2. 資料庫連線失敗
**問題：** 無法連接到資料庫
**解決：**
- 檢查 `DATABASE_URL` 格式
- 確認資料庫服務已啟動
- 檢查環境變數設定

### 3. 應用程式無法啟動
**問題：** 應用程式啟動失敗
**解決：**
- 檢查 `PORT` 環境變數
- 確認所有依賴已安裝
- 查看應用程式日誌

### 4. 檔案上傳問題
**問題：** 檔案上傳失敗
**解決：**
- 檢查 `UPLOAD_PATH` 設定
- 確認目錄權限
- 檢查檔案大小限制

## 📊 Render 免費方案限制

- **Web 服務**：750 小時/月
- **資料庫**：1GB 儲存空間
- **頻寬**：100GB/月
- **休眠**：15 分鐘無活動後休眠

## 🔄 自動部署

Render 會自動監控您的 GitHub 倉庫，當您推送新的程式碼時：
1. 自動觸發新的部署
2. 執行建置流程
3. 更新應用程式

## 🎉 完成！

您的應用程式現在已經成功部署到 Render！

**應用程式網址：** `https://your-app-name.onrender.com`

**重要提醒：**
1. 記住您的管理員帳號密碼
2. 定期備份資料庫
3. 監控應用程式效能
4. 設定適當的 CORS 政策

## 📞 需要幫助？

如果遇到問題，可以：
1. 查看 Render 官方文檔
2. 檢查應用程式日誌
3. 聯繫 Render 支援團隊
