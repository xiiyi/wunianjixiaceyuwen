# GitHub 上传清单 📋

## ✅ 需要上传的文件

### 根目录文件
- [x] `App.tsx` - 主应用组件
- [x] `data.ts` - 古诗数据
- [x] `index.css` - 样式文件
- [x] `index.html` - HTML 入口
- [x] `index.tsx` - React 入口
- [x] `metadata.json` - 元数据
- [x] `package.json` - 依赖配置
- [x] `package-lock.json` - 依赖锁定
- [x] `tsconfig.json` - TypeScript 配置
- [x] `types.ts` - 类型定义
- [x] `vite.config.ts` - Vite 配置
- [x] `README.md` - 项目说明
- [x] `.gitignore` - Git 忽略规则

### components/ 文件夹
- [x] `components/LiveTutor.tsx` - AI 导师组件
- [x] `components/PoemSelector.tsx` - 古诗选择器
- [x] `components/Quiz.tsx` - 测验组件
- [x] `components/Visualizer.tsx` - 可视化组件

### utils/ 文件夹
- [x] `utils/audioUtils.ts` - 音频工具
- [x] `utils/genai.ts` - AI 生成工具

---

## ❌ 不要上传的文件

- [ ] `node_modules/` - 依赖包（太大，可重建）
- [ ] `.DS_Store` - macOS 系统文件
- [ ] `.env.local` - ⚠️ 包含 API 密钥，绝对不要上传！

---

## 上传命令

```bash
git init
git add .
git commit -m "Initial commit: 五下古诗学习应用"
git remote add origin <你的GitHub仓库地址>
git push -u origin main
```

> 💡 提示：`.gitignore` 已配置好，运行 `git add .` 会自动排除不需要的文件。
