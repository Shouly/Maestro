'use client';

import { useState } from 'react';
import { AIInputWithSearch } from '../ui/ai-input-with-search';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInputProps {
  onSendMessage?: (message: Message) => void;
  className?: string;
}

export default function ChatInput({ onSendMessage, className }: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (value: string, withSearch: boolean) => {
    if (!value.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 如果提供了onSendMessage回调，调用它
      if (onSendMessage) {
        // 发送用户消息
        onSendMessage({
          role: 'user',
          content: withSearch ? `[搜索] ${value.trim()}` : value.trim()
        });
        
        // 模拟AI响应
        setTimeout(() => {
          onSendMessage({
            role: 'assistant',
            content: `这是对 "${value.trim()}" 的${withSearch ? '网络搜索' : ''}模拟响应。在实际应用中，这将由AI生成。`
          });
          setIsSubmitting(false);
        }, 800);
      }
    } catch (error) {
      console.error('发送消息时出错:', error);
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    console.log('选择的文件:', file);
    // 处理文件上传逻辑
    // 可以在这里添加文件处理、预览或上传的代码
  };

  return (
    <div className={cn("relative", className)}>
      <AIInputWithSearch
        placeholder="输入您的消息..."
        onSubmit={handleSubmit}
        onFileSelect={handleFileSelect}
        className={cn(
          isSubmitting && "opacity-80 pointer-events-none",
        )}
      />
      <div className="text-xs text-right mt-1 opacity-60 transition-opacity duration-[var(--transition-fast)] hover:opacity-100">
        按 <kbd className="px-1 rounded border border-[rgba(var(--color-border),1)] bg-[rgba(var(--color-card),0.5)]">Enter</kbd> 发送，
        <kbd className="px-1 rounded border border-[rgba(var(--color-border),1)] bg-[rgba(var(--color-card),0.5)]">Shift</kbd>+<kbd className="px-1 rounded border border-[rgba(var(--color-border),1)] bg-[rgba(var(--color-card),0.5)]">Enter</kbd> 换行
      </div>
    </div>
  );
} 