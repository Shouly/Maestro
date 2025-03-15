import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { AIService, Message, ToolOutput } from "../../services";
import { Loader2, Image as ImageIcon, Terminal, FileText, Brain, ChevronDown, ChevronUp, Paperclip, X, Maximize, Minimize } from "lucide-react";

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
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // 处理图片上传
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setError("只能上传图片文件");
      return;
    }
    
    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError("图片大小不能超过5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // 获取Base64编码的图片数据（去掉前缀）
        const base64Data = event.target.result.toString().split(',')[1];
        setUploadedImage(base64Data);
      }
    };
    reader.readAsDataURL(file);
    
    // 重置文件输入，以便可以再次选择同一文件
    e.target.value = '';
  };

  // 移除上传的图片
  const removeUploadedImage = () => {
    setUploadedImage(null);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;
    
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
    
    // 如果有上传的图片，添加到工具输出
    if (uploadedImage) {
      userMessage.toolOutputs = [
        {
          type: "screenshot",
          content: uploadedImage
        }
      ];
    }
    
    // 更新消息列表
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setUploadedImage(null);
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

  // 切换思考内容的展开/折叠状态
  const toggleThinking = (messageId: string) => {
    setExpandedThinking(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  // 切换图片的展开/折叠状态
  const toggleImageExpand = (imageId: string) => {
    setExpandedImages(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  // 渲染工具输出
  const renderToolOutput = (output: ToolOutput, index: number, messageId: string) => {
    if (output.error) {
      return (
        <div key={index} className="mt-2 p-2 rounded bg-destructive/10 text-destructive text-xs">
          <div className="font-semibold">错误:</div>
          <div className="whitespace-pre-wrap">{output.error}</div>
        </div>
      );
    }

    const timestamp = new Date().toLocaleTimeString();
    const imageId = `${messageId}-${index}`;
    const isImageExpanded = expandedImages[imageId] || false;

    switch (output.type) {
      case "screenshot":
        return (
          <div key={index} className="mt-2 p-2 rounded bg-muted">
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <div className="flex items-center">
                <ImageIcon className="h-3 w-3 mr-1" />
                <span>截图</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">{timestamp}</span>
                <button 
                  onClick={() => toggleImageExpand(imageId)}
                  className="p-1 hover:bg-muted-foreground/10 rounded"
                  title={isImageExpanded ? "缩小" : "放大"}
                >
                  {isImageExpanded ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
                </button>
              </div>
            </div>
            <div className={isImageExpanded ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4" : ""}>
              {isImageExpanded && (
                <div className="relative max-w-full max-h-full overflow-auto">
                  <button 
                    onClick={() => toggleImageExpand(imageId)}
                    className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img 
                    src={`data:image/png;base64,${output.content}`} 
                    alt="截图" 
                    className="max-w-full h-auto rounded border border-border"
                  />
                </div>
              )}
              {!isImageExpanded && (
                <img 
                  src={`data:image/png;base64,${output.content}`} 
                  alt="截图" 
                  className="max-w-full h-auto rounded border border-border cursor-pointer"
                  onClick={() => toggleImageExpand(imageId)}
                />
              )}
            </div>
          </div>
        );
      case "command":
        return (
          <div key={index} className="mt-2 p-2 rounded bg-muted">
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <div className="flex items-center">
                <Terminal className="h-3 w-3 mr-1" />
                <span>命令输出</span>
              </div>
              <span className="text-muted-foreground">{timestamp}</span>
            </div>
            <pre className="text-xs overflow-auto max-h-60 whitespace-pre-wrap">{output.content}</pre>
          </div>
        );
      case "text":
        return (
          <div key={index} className="mt-2 p-2 rounded bg-muted">
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <div className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                <span>文本输出</span>
              </div>
              <span className="text-muted-foreground">{timestamp}</span>
            </div>
            <pre className="text-xs overflow-auto max-h-60 whitespace-pre-wrap">{output.content}</pre>
          </div>
        );
      default:
        return null;
    }
  };

  // 渲染思考内容
  const renderThinking = (thinking: any[], messageId: string) => {
    const isExpanded = expandedThinking[messageId];
    
    if (!thinking || thinking.length === 0) return null;
    
    return (
      <div className="mt-3 border-t border-border pt-2">
        <button 
          onClick={() => toggleThinking(messageId)}
          className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Brain className="h-3 w-3 mr-1" />
          <span>思考过程</span>
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 ml-1" />
          ) : (
            <ChevronDown className="h-3 w-3 ml-1" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2 p-2 rounded bg-muted/50 text-xs">
            <pre className="whitespace-pre-wrap overflow-auto max-h-60">
              {thinking.map((block, index) => {
                if (block.type === "thinking" && block.text) {
                  return <div key={index} className="mb-2">{block.text}</div>;
                }
                return null;
              })}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-2 flex justify-between items-center bg-muted/30">
        <div className="font-semibold">Maestro AI 助手</div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center">
            <span className="mr-1">图像限制:</span>
            <select 
              value={onlyNMostRecentImages} 
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setOnlyNMostRecentImages(value);
                localStorage.setItem("imageLimit", value.toString());
              }}
              className="rounded border border-input bg-background px-2 py-1 text-xs"
            >
              <option value="0">不限制</option>
              <option value="1">最近1张</option>
              <option value="3">最近3张</option>
              <option value="5">最近5张</option>
              <option value="10">最近10张</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={enablePromptCaching}
                onChange={(e) => {
                  setEnablePromptCaching(e.target.checked);
                  localStorage.setItem("promptCaching", e.target.checked.toString());
                }}
                className="mr-1 h-3 w-3"
              />
              <span>启用缓存</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <div className="text-lg font-semibold mb-2">开始与AI助手对话</div>
            <div className="text-sm max-w-md text-center">
              您可以要求AI助手执行各种任务，如截取屏幕、控制鼠标、执行命令、编辑文件等。
              <br /><br />
              示例: "请截取当前屏幕" 或 "帮我打开计算器应用"
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col rounded-lg px-4 py-2 text-sm",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground max-w-[80%]"
                  : "mr-auto bg-muted max-w-[90%]"
              )}
            >
              {/* 消息角色标识 */}
              <div className="text-xs text-muted-foreground mb-1">
                {message.role === "user" ? "您" : "AI助手"}
                <span className="ml-2">{new Date(message.timestamp).toLocaleTimeString()}</span>
              </div>
              
              {/* 消息内容 */}
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* 显示工具输出 */}
              {message.toolOutputs && message.toolOutputs.length > 0 && (
                <div className="mt-2">
                  {message.toolOutputs.map((output, index) => renderToolOutput(output, index, message.id))}
                </div>
              )}
              
              {/* 显示思考内容 */}
              {message.thinking && message.thinking.length > 0 && renderThinking(message.thinking, message.id)}
            </div>
          ))
        )}
        
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
        {/* 图片预览 */}
        {uploadedImage && (
          <div className="mb-2 p-2 border rounded-md relative">
            <button 
              onClick={removeUploadedImage}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
            >
              <X className="h-3 w-3" />
            </button>
            <img 
              src={`data:image/png;base64,${uploadedImage}`} 
              alt="上传的图片" 
              className="max-h-32 rounded"
            />
          </div>
        )}
        
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
          
          {/* 图片上传按钮 */}
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="上传图片"
          >
            <Paperclip className="h-4 w-4" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </Button>
          
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "发送"}
          </Button>
        </div>
      </div>
    </div>
  );
} 