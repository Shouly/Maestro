import ChatInput from "@/components/chat/chat-input";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* 聊天头部 */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">新对话</h1>
      </div>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
        <div className="space-y-4">
          {/* 欢迎消息 */}
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-[#0090FF] flex items-center justify-center text-white">
              M
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <p className="text-slate-800 dark:text-slate-200">
                欢迎使用 Maestro AI 聊天助手！请在下方输入框中输入您的问题。
              </p>
              <p className="text-slate-800 dark:text-slate-200 mt-2">
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