#!/usr/bin/env node

/**
 * 簡化版 Render 啟動腳本
 * 專注於快速啟動，避免複雜的初始化過程
 */

console.log('🚀 開始啟動應用程式...');

// 設定環境變數
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// 檢查必要的環境變數
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ 缺少必要的環境變數:', missingVars.join(', '));
  console.error('請在 Render Dashboard 中設定這些環境變數');
  process.exit(1);
}

console.log('✅ 環境變數檢查通過');

// 設定超時處理
const startupTimeout = setTimeout(() => {
  console.error('❌ 啟動超時，強制退出');
  process.exit(1);
}, 30000); // 30秒超時

// 啟動應用程式
try {
  console.log('🌐 載入應用程式...');
  require('./app.js');
  
  // 清除超時
  clearTimeout(startupTimeout);
  console.log('✅ 應用程式啟動成功');
} catch (error) {
  clearTimeout(startupTimeout);
  console.error('💥 應用程式啟動失敗:', error.message);
  console.error('錯誤詳情:', error);
  process.exit(1);
}
