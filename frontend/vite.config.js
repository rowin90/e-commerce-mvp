/*
 * @Author: 饶驹 raoju1580@qq.com
 * @Date: 2025-07-30 20:02:57
 * @LastEditors: 饶驹 raoju1580@qq.com
 * @LastEditTime: 2025-07-30 20:03:06
 * @FilePath: /e-m/e-commerce-mvp/vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});