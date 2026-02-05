# 五年级古诗词学习应用 📜

一个专为五年级学生设计的古诗词学习应用，结合 AI 技术提供沉浸式的诗词学习体验。

## ✨ 功能特点

### 🎯 闯关答题模式
- **画中诗 (看图选诗)**: 根据 AI 生成的意境图片选择对应诗句
- **正字音 (火眼金睛)**: 练习识别正确的读音和字形
- **解词义 (字词解密)**: 学习古诗词中的重点词汇含义
- **悟诗情 (诗情画意)**: 理解诗词表达的情感和主题

### 🤖 AI 私教模式
使用 Gemini Live API 进行实时语音交互，支持：
- 诗词背诵练习
- 字词读音纠正
- 诗意理解讲解
- 互动问答学习

## 🚀 本地运行

**前提条件:** Node.js 18+

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置 API Key：
   在 `.env.local` 文件中设置您的 Gemini API Key：
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   
   > 💡 获取 API Key：访问 [Google AI Studio](https://aistudio.google.com/apikey)

3. 启动应用：
   ```bash
   npm run dev
   ```

4. 打开浏览器访问 `http://localhost:3000`

## 📝 关于 API Key

- **Quiz 模式**: 没有 API Key 时，会使用精选的风景图片作为备用
- **AI 私教模式**: 需要有效的 API Key 才能使用语音交互功能

## 🎨 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS (CDN) + 自定义 CSS
- **AI 能力**: Google Gemini API
  - 图片生成: `gemini-2.5-flash-image`
  - 语音对话: `gemini-2.5-flash-native-audio-preview`

## 📚 收录诗词

本应用收录了五年级下册的经典古诗词，包括：
- 《四时田园杂兴》- 范成大
- 《稚子弄冰》- 杨万里
- 《村晚》- 雷震
- 《游子吟》- 孟郊
- 《闻官军收河南河北》- 杜甫
- 更多...

## 🌟 设计理念

应用采用传统水墨画风格设计，配色以宣纸米色、墨色、朱砂红为主，营造古典书卷气息，让学生在美的氛围中学习古诗词文化。

## 📄 许可证

MIT License

---

<div align="center">
  <p>用心学诗词，传承中华文化 🏮</p>
</div>
