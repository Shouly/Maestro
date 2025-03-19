# Maestro AI 聊天助手

Maestro 是一款面向 AI 爱好者、开发者、内容创作者和研究专业人员的跨平台桌面聊天助手应用程序。该应用将多个 AI 模型（如 OpenAI、Anthropic、Deepseek、Ollama 和 OpenRouter）整合到一个统一界面中，通过清晰的三面板布局简化日常 AI 工作流程，实现统一访问。

## 功能特点

- 统一 AI 模型接口（用户自备 API 密钥）
- 三面板布局：对话历史、活动聊天和工件区域
- 基于云的数据同步（Supabase）
- 安全认证系统（Clerk Auth）
- MCP 服务器集成，支持自定义工具扩展
- 支持中文和英文
- 跨平台兼容性（Windows、macOS、Linux）

## 技术栈

- **前端**: Next.js 15, React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **后端**: Tauri 2.0, Rust
- **数据库**: Supabase
- **认证**: Clerk Auth

## 启动项目

### 前提条件

- Node.js 18+ 和 npm
- Rust 环境（用于 Tauri）
- 根据操作系统的 Tauri 系统依赖

### 开发环境设置

1. 克隆仓库
```bash
git clone <repository-url>
cd maestro
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
创建 `.env.local` 文件，添加必要的环境变量：
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 启动开发服务器（网页版）
```bash
npm run dev
```

5. 启动 Tauri 开发服务器（桌面应用）
```bash
npm run tauri:dev
```

### 构建应用

```bash
npm run tauri:build
```

## 项目结构

```
maestro/
├── app/                    # Next.js 应用目录
│   ├── api/                # API 路由
│   ├── auth/               # 认证相关页面
│   ├── dashboard/          # 仪表板/主应用页面
│   ├── mcp/                # MCP 服务器配置页面
│   └── ui/                 # UI 组件
├── components/             # 共享组件
├── lib/                    # 工具函数和共享逻辑
├── public/                 # 静态资源
└── src-tauri/              # Tauri 应用目录
    ├── src/                # Rust 代码
    └── Cargo.toml          # Rust 依赖配置
```

## 贡献指南

欢迎提交 Pull Request，为项目做出贡献！请确保遵循项目的代码风格和规范。

## 许可证

[MIT](LICENSE)
