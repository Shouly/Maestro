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
      
      // 发送消息到Claude API
      const { message: assistantMessage, toolResults } = await AIService.sendMessage(recentMessages);
      
      // 如果有工具调用结果，添加到消息中
      if (toolResults.length > 0) {
        assistantMessage.toolOutputs = toolResults;
        
        // 通知父组件工具输出
        if (onToolOutput) {
          onToolOutput(toolResults[0]);
        }
        
        // 创建用户消息，包含工具输出
        const toolResponseMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: "工具执行结果",
          timestamp: Date.now(),
          toolOutputs: toolResults,
        };
        
        // 更新消息列表，添加助手消息和工具响应消息
        setMessages((prev) => [...prev, assistantMessage, toolResponseMessage]);
      } else {
        // 没有工具调用，只添加助手消息
        setMessages((prev) => [...prev, assistantMessage]);
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