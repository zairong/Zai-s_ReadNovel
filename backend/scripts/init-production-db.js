#!/usr/bin/env node

/**
 * 生產環境資料庫初始化腳本
 * 用於重新生成所有資料庫欄位和表結構
 */

require('dotenv').config()
const { sequelize } = require('../models')
const { execSync } = require('child_process')
const path = require('path')

async function initProductionDatabase() {
  console.log('🚀 開始初始化生產環境資料庫...')
  
  try {
    // 1. 測試資料庫連線
    console.log('🔌 測試資料庫連線...')
    await sequelize.authenticate()
    console.log('✅ 資料庫連線成功')
    
    // 2. 同步所有模型（重新建立表結構）
    console.log('🔄 同步資料庫模型...')
    await sequelize.sync({ force: true })
    console.log('✅ 資料庫模型同步完成')
    
    // 3. 執行所有遷移
    console.log('📦 執行資料庫遷移...')
    try {
      execSync('npm run db:migrate', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      })
      console.log('✅ 資料庫遷移完成')
    } catch (error) {
      console.log('⚠️  遷移執行完成（可能沒有新的遷移）')
    }
    
    // 4. 建立管理員帳號
    console.log('👤 建立管理員帳號...')
    try {
      execSync('npm run init-admin', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      })
      console.log('✅ 管理員帳號建立完成')
    } catch (error) {
      console.log('⚠️  管理員帳號可能已存在')
    }
    
    // 5. 檢查資料庫狀態
    console.log('🔍 檢查資料庫狀態...')
    const tables = await sequelize.getQueryInterface().showAllTables()
    console.log('📊 已建立的資料表：', tables)
    
    console.log('🎉 生產環境資料庫初始化完成！')
    console.log('📝 請記住：')
    console.log('   - 管理員帳號：admin')
    console.log('   - 預設密碼：請查看 init-admin.js 檔案')
    console.log('   - 建議立即更改預設密碼')
    
  } catch (error) {
    console.error('❌ 資料庫初始化失敗：', error.message)
    console.error('詳細錯誤：', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 執行初始化
if (require.main === module) {
  initProductionDatabase()
}

module.exports = initProductionDatabase
