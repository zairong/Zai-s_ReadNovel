# 📤 GitHub 上傳指南

## 🎯 部署策略建議

### 方案一：分離部署（推薦）⭐

#### 後端 (ExpressByMySQL) → Render
- 只上傳 `ExpressByMySQL` 資料夾
- 部署到 Render 作為 API 服務

#### 前端 (frontend) → Vercel/Netlify
- 只上傳 `frontend` 資料夾
- 部署到 Vercel 或 Netlify 作為前端服務

**優點：**
- 前後端獨立部署和維護
- 更好的效能和擴展性
- 可以分別設定不同的環境變數

### 方案二：單一倉庫部署

#### 整個專案 → Render
- 上傳整個專案（包含前後端）
- 在 Render 上同時部署前後端

**優點：**
- 管理簡單
- 只需要一個倉庫

## 🚀 推薦步驟（方案一）

### 步驟 1：建立後端倉庫
```bash
# 進入後端目錄
cd ExpressByMySQL

# 初始化 Git
git init

# 新增所有檔案
git add .

# 提交
git commit -m "Initial backend commit"

# 在 GitHub 建立新倉庫：your-username/expressbymysql-backend
git remote add origin https://github.com/your-username/expressbymysql-backend.git
git branch -M main
git push -u origin main
```

### 步驟 2：建立前端倉庫
```bash
# 進入前端目錄
cd ../frontend

# 初始化 Git
git init

# 新增所有檔案
git add .

# 提交
git commit -m "Initial frontend commit"

# 在 GitHub 建立新倉庫：your-username/expressbymysql-frontend
git remote add origin https://github.com/your-username/expressbymysql-frontend.git
git branch -M main
git push -u origin main
```

### 步驟 3：部署後端到 Render
1. 前往 [render.com](https://render.com)
2. 連接 `expressbymysql-backend` 倉庫
3. 建立 Web 服務
4. 設定環境變數

### 步驟 4：部署前端到 Vercel
1. 前往 [vercel.com](https://vercel.com)
2. 連接 `expressbymysql-frontend` 倉庫
3. 設定環境變數：
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

## 📁 檔案上傳清單

### 後端需要上傳的檔案：
```
ExpressByMySQL/
├── api/
├── config/
├── controllers/
├── middleware/
├── migrations/
├── models/
├── routes/
├── scripts/
├── utils/
├── uploads/ (空目錄，保留結構)
├── app.js
├── package.json
├── render.yaml
├── .gitignore
└── 其他配置檔案
```

### 前端需要上傳的檔案：
```
frontend/
├── src/
├── public/
├── dist/
├── package.json
├── vite.config.js
└── 其他配置檔案
```

## 🚫 不需要上傳的檔案：

- `node_modules/` - 依賴套件
- `.env` - 環境變數檔案
- `*.log` - 日誌檔案
- `uploads/*` - 上傳的檔案內容（保留目錄結構）
- `.DS_Store` - 系統檔案

## 🔧 環境變數設定

### 後端 (Render)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
```

### 前端 (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

## 🎉 完成後的效果

- **後端 API**: `https://your-backend.onrender.com`
- **前端網站**: `https://your-frontend.vercel.app`
- 前端會自動連接到後端 API

## 📝 注意事項

1. **CORS 設定**: 確保後端允許前端域名訪問
2. **環境變數**: 前端需要知道後端的網址
3. **檔案上傳**: 後端的 uploads 目錄會是空的，需要重新上傳檔案
4. **資料庫**: 需要重新初始化資料庫

## 🆘 如果遇到問題

1. 檢查 `.gitignore` 是否正確
2. 確認環境變數設定
3. 查看部署日誌
4. 測試 API 連線
