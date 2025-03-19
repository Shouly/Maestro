import ChatInput from "@/components/chat/chat-input";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* 聊天头部 */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">新对话</h1>
      </div>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 bg-[var(--color-muted)]">
        <div className="space-y-4">
          {/* 欢迎消息 */}
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              M
            </div>
            <div className="card">
              <p className="text-[var(--color-card-foreground)]">
                欢迎使用 Maestro AI 聊天助手！请在下方输入框中输入您的问题。
              </p>
              <p className="text-[var(--color-card-foreground)] mt-2">
                您需要设置 API 密钥才能开始使用各种 AI 模型。点击右上角设置按钮进行配置。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 使用客户端聊天输入组件 */}
      <ChatInput />
    </div>
  );
} 