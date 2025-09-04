# 部署指南

## 1. 網路資料庫設定

### 選擇資料庫服務提供商
推薦的雲端資料庫服務：
- **PlanetScale** (MySQL 相容，免費方案)
- **Railway** (MySQL，簡單易用)
- **AWS RDS** (MySQL，企業級)
- **Google Cloud SQL** (MySQL)
- **DigitalOcean Managed Database** (MySQL)

### 設定環境變數
建立 `.env` 檔案（不要提交到版本控制）：

```bash
# 生產環境設定
NODE_ENV=production

# 資料庫設定 - 使用 DATABASE_URL (推薦)
DATABASE_URL=mysql://username:password@your-db-host:3306/your-database-name

# 或分別設定
# DB_HOST=your-db-host.com
# DB_PORT=3306
# DB_NAME=your-database-name
# DB_USERNAME=your-username
# DB_PASSWORD=your-password

# JWT 設定
JWT_SECRET=your-super-secure-jwt-secret-key-here

# 伺服器設定
PORT=3000

# 檔案上傳設定
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## 2. 重新生成資料庫欄位

### 執行遷移
```bash
# 安裝依賴
npm install

# 執行所有遷移
npm run db:migrate

# 檢查遷移狀態
npm run db:migrate:status
```

## 3. 部署平台選擇

### Heroku (推薦新手)
1. 註冊 Heroku 帳號
2. 安裝 Heroku CLI
3. 建立應用程式
4. 設定環境變數
5. 部署

### Railway (簡單易用)
1. 註冊 Railway 帳號
2. 連接 GitHub 倉庫
3. 設定環境變數
4. 自動部署

### Vercel (適合 Node.js)
1. 註冊 Vercel 帳號
2. 連接 GitHub 倉庫
3. 設定環境變數
4. 部署

## 4. 部署步驟

### 使用 Heroku 部署
```bash
# 安裝 Heroku CLI
# 登入
heroku login

# 建立應用程式
heroku create your-app-name

# 設定環境變數
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your-database-url
heroku config:set JWT_SECRET=your-jwt-secret

# 部署
git add .
git commit -m "Deploy to production"
git push heroku main

# 執行遷移
heroku run npm run db:migrate
```

### 使用 Railway 部署
1. 前往 [Railway.app](https://railway.app)
2. 連接 GitHub 倉庫
3. 在 Railway 控制台設定環境變數
4. 自動部署完成

## 5. 驗證部署

### 檢查應用程式狀態
```bash
# Heroku
heroku ps

# 查看日誌
heroku logs --tail
```

### 測試 API 端點
```bash
# 測試健康檢查
curl https://your-app-name.herokuapp.com/api/health

# 測試資料庫連線
curl https://your-app-name.herokuapp.com/api/books
```

## 6. 常見問題

### 資料庫連線問題
- 檢查 DATABASE_URL 格式是否正確
- 確認資料庫服務是否允許外部連線
- 檢查防火牆設定

### 遷移失敗
- 檢查資料庫權限
- 確認遷移檔案語法正確
- 查看詳細錯誤訊息

### 檔案上傳問題
- 確認上傳目錄權限
- 檢查檔案大小限制
- 設定適當的靜態檔案服務
