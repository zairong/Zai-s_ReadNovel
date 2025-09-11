// 只在沒有環境變數時載入 .env 文件
if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require('method-override')
const path = require('path')
const cors = require('cors')
const app = express()
const { sequelize } = require('./models')
const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10)

// 引入 API 路由模組
const apiRoutes = require('./api/index')

// CORS 中間件設定
const corsOptions = {
  origin: [
    'https://zaisnovel-frontend.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Origin',
    'Accept',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  optionsSuccessStatus: 200 // 支援舊版瀏覽器
}

app.use(cors(corsOptions))

// 專門處理 OPTIONS 請求的中間件
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept, Access-Control-Request-Method, Access-Control-Request-Headers')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Max-Age', '86400') // 24 小時
  res.sendStatus(200)
})

// 中間件設定（提高 body 大小限制，避免描述或少量 Base64 過大導致 413）
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(express.json({ limit: '2mb' }))
app.use(methodOverride('_method'))

// 靜態檔案
app.use(express.static(path.join(__dirname, 'public')))
// 封面圖片靜態檔案服務
app.use('/uploads/covers', express.static(path.join(__dirname, 'uploads', 'covers')))

// API 路由設定
app.use('/api', apiRoutes)

// 404 錯誤處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API 端點未找到'
  })
})

// 錯誤處理中間件
app.use((err, req, res, next) => {
  // 更完整的錯誤分類與回應
  console.error('❌ Error caught by handler:', err && (err.stack || err))
  let status = err && (err.status || err.statusCode) || 500
  let message = '伺服器錯誤'

  // 請求內容過大（body-parser）
  if (err && err.type === 'entity.too.large') {
    status = 413
    message = '請求內容過大'
  }
  // Sequelize 常見錯誤
  else if (err && (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeDatabaseError')) {
    status = 400
    message = err.message
  }

  res.status(status).json({
    success: false,
    message,
    error: err && err.message
  })
})

function listenOnAvailablePort(app, preferredPort) {
  return new Promise((resolve) => {
    const server = app.listen(preferredPort)
    server.on('listening', () => resolve({ server, port: preferredPort }))
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        const nextPort = preferredPort + 1
        console.warn(`⚠️  埠號 ${preferredPort} 已被佔用，改嘗試 ${nextPort} ...`)
        resolve(listenOnAvailablePort(app, nextPort))
      } else {
        throw err
      }
    })
  })
}

async function start() {
  try {
    console.log('🔧 環境變數狀態檢查:')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '已設定' : '未設定')
    console.log('DB_HOST:', process.env.DB_HOST || '未設定')
    console.log('DB_PORT:', process.env.DB_PORT || '未設定')
    console.log('DB_NAME:', process.env.DB_NAME || '未設定')
    console.log('DB_USERNAME:', process.env.DB_USERNAME || '未設定')
    console.log('NODE_ENV:', process.env.NODE_ENV || '未設定')
    
    console.log('🔌 測試資料庫連線...')
    await sequelize.authenticate()
    console.log('✅ 資料庫連線成功')
  } catch (error) {
    console.error('❌ 無法連線至資料庫：', error.message)
    console.error('👉 請檢查 .env 是否正確設定 DB_HOST/DB_PORT/DB_NAME/DB_USERNAME/DB_PASSWORD 或 DATABASE_URL')
    process.exit(1)
  }

  const { port } = await listenOnAvailablePort(app, DEFAULT_PORT)
  console.log(`🚀 API 服務器正在運行於 http://localhost:${port}`)
  console.log(`📦 API 路由: /api`)
}

start()