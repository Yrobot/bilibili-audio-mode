# Bilibili Audio Mode

B站音频模式油猴脚本 - 隐藏视频画面，只播放音频

## 功能

- 🎧 隐藏视频画面，只播放音频
- 🎨 悬浮按钮一键切换（页面右下角）
- 📌 状态徽章显示在播放器中央
- 💾 自动保存开关状态
- 🔄 页面刷新后自动恢复
- 🛡️ 防止 B站播放器重置样式
- 📦 支持自动更新

## 安装

1. 安装油猴扩展（[Tampermonkey](https://www.tampermonkey.net/) / [Violentmonkey](https://violentmonkey.github.io/)）
2. 点击下方链接安装脚本：
   - [点击安装 Bilibili Audio Mode](https://raw.githubusercontent.com/Yrobot/bilibili-audio-mode/main/dist/bilibili-audio-mode.user.js)
3. 在油猴扩展确认页面点击「安装」

> 脚本支持自动更新，push 新版本后油猴扩展会自动检测并提示升级。

## 使用

1. 打开任意 B站视频页面
2. 右下角出现 🎧 悬浮按钮
3. 点击按钮切换音频模式
4. 播放器中央会显示状态徽章和关闭按钮

## 开发

### 环境要求

- Node.js >= 18
- npm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

构建产物：

- `dist/bilibili-audio-mode.user.js` — 完整脚本（安装用）
- `dist/bilibili-audio-mode.meta.js` — UserScript 头（自动更新检测用）

### 类型检查

```bash
npm run typecheck
```

## 项目结构

```
bilibili-audio-mode/
├── src/
│   ├── main.ts          # 油猴脚本入口
│   ├── controller.ts    # 核心控制器
│   ├── styles.ts        # 样式注入
│   └── icons.ts         # Lucide 图标
├── build.ts             # 构建脚本
├── tsconfig.json        # TypeScript 配置
├── package.json
└── dist/
    ├── bilibili-audio-mode.user.js  # 完整脚本
    └── bilibili-audio-mode.meta.js  # 更新检测用
```

## 技术实现

### 核心原理

- 通过 CSS `visibility: hidden` 隐藏视频画面
- 使用 `setInterval` 持续检测样式是否被 B站播放器重置
- 每 300ms 检测一次，最多运行 15 秒

### 为什么不用拦截 SourceBuffer？

B站使用 MSE (MediaSource Extensions) 播放视频，拦截 `SourceBuffer.appendBuffer` 会导致：

- 播放器初始化失败
- 控制台报错 `InvalidStateError`
- 播放/暂停循环

### 油猴脚本的限制

油猴脚本无法拦截网络请求（需要浏览器扩展的 `declarativeNetRequest` API），因此：

- 视频数据仍会下载（带宽未节省）
- 但视频不会渲染（节省 GPU）

如需真正节省带宽，请使用浏览器扩展版本。

## 样式参考

- 主色：`#00a1d6`（B站蓝）
- 字体：`-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif`
- 圆角：`8px` / `12px`
- 阴影：`0 2px 12px rgba(0, 0, 0, 0.15)`

## 作者

[@yrobot](https://github.com/Yrobot)
