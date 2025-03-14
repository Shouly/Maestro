# Maestro

Maestro是一个AI驱动的计算机控制助手，允许用户通过Claude AI模型控制计算机，执行各种任务，包括屏幕交互、命令执行和文本编辑等。

## 功能特点

- **AI对话界面**：通过自然语言与AI助手交流
- **屏幕控制**：AI可以截取屏幕、移动鼠标、点击按钮，以及执行键盘操作
- **命令执行**：运行系统命令，管理进程，并查看命令输出结果
- **文本编辑**：读取、编辑和保存文件，支持多种编程语言的语法高亮
- **跨平台支持**：支持Windows、macOS和Linux

## 技术栈

- **前端**：Vite + React + Tailwind CSS + shadcn/ui
- **后端**：Tauri + Rust
- **AI**：Anthropic Claude API

## 开发环境设置

### 前提条件

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (v1.0+)
- [Rust](https://www.rust-lang.org/) (v1.70+)
- [Tauri CLI](https://tauri.app/v2/guides/getting-started/prerequisites)

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/maestro.git
   cd maestro
   ```

2. 安装依赖
   ```bash
   bun install
   ```

3. 运行开发服务器
   ```bash
   bun run tauri dev
   ```

## 构建应用

```bash
bun run tauri build
```

构建完成后，可以在`src-tauri/target/release`目录找到可执行文件。

## 项目结构

```
maestro/
├── src/                  # 前端源代码
│   ├── components/       # React组件
│   ├── pages/            # 页面组件
│   ├── lib/              # 工具函数和hooks
│   └── ...
├── src-tauri/            # Rust后端代码
│   ├── src/              # Rust源代码
│   ├── Cargo.toml        # Rust依赖配置
│   └── ...
├── public/               # 静态资源
├── PROGRESS.md           # 项目进度跟踪
└── ...
```

## 使用方法

1. 启动应用后，首次使用会引导您设置API密钥
2. 在主界面中，您可以通过聊天界面与AI助手交流
3. 使用自然语言指令让AI执行各种任务
4. 在设置页面中，您可以配置API密钥、模型选择和界面设置

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请查看[PROGRESS.md](./PROGRESS.md)了解当前项目进度和下一步工作重点。

## 许可证

[MIT](LICENSE)
