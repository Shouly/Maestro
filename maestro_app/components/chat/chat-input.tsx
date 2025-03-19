'use client';

import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInputProps {
  onSendMessage?: (message: Message) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动聚焦输入框
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 如果提供了onSendMessage回调，调用它
      if (onSendMessage) {
        onSendMessage({
          role: 'user',
          content: input.trim()
        });
        
        // 这里可以添加调用API的逻辑
        // 模拟响应
        setTimeout(() => {
          onSendMessage({
            role: 'assistant',
            content: `这是对 "${input.trim()}" 的模拟响应。在实际应用中，这将由AI生成。`
          });
          setIsSubmitting(false);
        }, 800);
      }
      
      // 清空输入
      setInput('');
    } catch (error) {
      console.error('发送消息时出错:', error);
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div 
        className={cn(
          "glass flex items-end rounded-xl p-3 transition-all duration-[var(--transition-normal)]",
          isFocused && "shadow-md border-[rgba(var(--color-primary),0.5)]",
          isSubmitting && "opacity-80"
        )}
      >
        <TextareaAutosize
          ref={textareaRef}
          placeholder="输入您的消息..."
          className={cn(
            "flex-1 bg-transparent border-none resize-none max-h-32 focus:outline-none",
            "transition-all duration-[var(--transition-normal)]"
          )}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isSubmitting}
          minRows={1}
          maxRows={5}
          aria-label="聊天输入框"
        />
        <Button 
          type="submit" 
          variant="default"
          size="icon"
          className={cn(
            "ml-2 rounded-xl p-2",
            (!input.trim() || isSubmitting) && "opacity-50"
          )}
          disabled={isSubmitting || !input.trim()}
          aria-label="发送消息"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="text-xs text-right mt-1 opacity-60 transition-opacity duration-[var(--transition-fast)] hover:opacity-100">
        按 <kbd className="px-1 rounded border border-[rgba(var(--color-border),1)] bg-[rgba(var(--color-card),0.5)]">Enter</kbd> 发送，
        <kbd className="px-1 rounded border border-[rgba(var(--color-border),1)] bg-[rgba(var(--color-card),0.5)]">Shift</kbd>+<kbd className="px-1 rounded border border-[rgba(var(--color-border),1)] bg-[rgba(var(--color-card),0.5)]">Enter</kbd> 换行
      </div>
    </form>
  );
} 