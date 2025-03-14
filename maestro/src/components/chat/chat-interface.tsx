import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { AIService, Message, ToolOutput } from "../../services";
import { Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  onToolOutput?: (output: ToolOutput) => void;
}

export function ChatInterface({ onToolOutput }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlyNMostRecentImages, setOnlyNMostRecentImages] = useState<number>(3); // 默认保留最近3张图像
  const [thinkingBudget, setThinkingBudget] = useState<number | undefined>(undefined); // 默认不启用思考
  const [enablePromptCaching, setEnablePromptCaching] = useState<boolean>(true); // 默认启用提示缓存
  const [enableTokenEfficientTools, setEnableTokenEfficientTools] = useState<boolean>(true); // 默认启用token高效工具
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载历史消息
  useEffect(() => {
    const loadMessages = () => {
      const savedMessages = localStorage.getItem("messages");
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (error) {
          console.error("加载历史消息失败:", error);
        }
      }
    };

    loadMessages();
  }, []);

  // 保存消息到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 加载图像数量限制设置
  useEffect(() => {
    const savedImageLimit = localStorage.getItem("imageLimit");
    if (savedImageLimit) {
      setOnlyNMostRecentImages(parseInt(savedImageLimit, 10));
    }
    
    // 加载思考预算设置
    const savedThinkingBudget = localStorage.getItem("thinkingBudget");
    if (savedThinkingBudget) {
      setThinkingBudget(parseInt(savedThinkingBudget, 10));
    }
    
    // 加载提示缓存设置
    const savedPromptCaching = localStorage.getItem("promptCaching");
    if (savedPromptCaching) {
      setEnablePromptCaching(savedPromptCaching === "true");
    }
    
    // 加载token高效工具设置
    const savedTokenEfficientTools = localStorage.getItem("enableTokenEfficientTools");
    if (savedTokenEfficientTools) {
      setEnableTokenEfficientTools(savedTokenEfficientTools === "true");
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // 检查API密钥是否设置
    const apiKey = AIService.getApiKey();
    if (!apiKey) {
      setError("请先在设置页面配置API密钥");
      return;
    }
    
    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    
    // 更新消息列表
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);
    
    try {
      // 获取最近的消息作为上下文
      const recentMessages = [...messages, userMessage].slice(-10);
      
      // 发送消息到Claude API，现在返回完整的消息历史，并传递图像数量限制和思考预算
      const updatedMessages = await AIService.sendMessage(
        recentMessages, 
        undefined, 
        onlyNMostRecentImages,
        thinkingBudget,
        enablePromptCaching
      );
      
      // 提取新消息（用户消息之后的所有消息）
      const newMessages = updatedMessages.slice(recentMessages.indexOf(userMessage) + 1);
      
      // 更新消息列表
      setMessages((prev) => [...prev.slice(0, prev.length - 1), userMessage, ...newMessages]);
      
      // 检查是否有工具输出消息
      for (const msg of newMessages) {
        if (msg.toolOutputs && msg.toolOutputs.length > 0 && onToolOutput) {
          // 通知父组件最新的工具输出
          onToolOutput(msg.toolOutputs[0]);
          break;
        }
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      setError(`发送消息失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-max max-w-[80%] flex-col rounded-lg px-4 py-2 text-sm",
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {/* 显示工具输出 */}
            {message.toolOutputs && message.toolOutputs.length > 0 && (
              <div className="mt-2 text-xs opacity-80">
                {message.toolOutputs.map((output, index) => (
                  <div key={index} className="mt-1">
                    {output.error ? (
                      <span className="text-destructive">错误: {output.error}</span>
                    ) : (
                      <span>
                        {output.type === "screenshot" ? (
                          "截图已捕获"
                        ) : (
                          `工具输出: ${output.content.substring(0, 50)}${output.content.length > 50 ? '...' : ''}`
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        {/* 错误消息 */}
        {error && (
          <div className="mx-auto max-w-[80%] rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="输入消息..."
            disabled={isLoading}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "发送"}
          </Button>
        </div>
      </div>
    </div>
  );
} 