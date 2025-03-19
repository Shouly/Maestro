'use client';

import { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import TextareaAutosize from 'react-textarea-autosize';

interface ChatInputProps {
  onSendMessage?: (message: any) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        }, 500);
      }
      
      // 清空输入
      setInput('');
    } catch (error) {
      console.error('发送消息时出错:', error);
    } finally {
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
      <div className="glass-input flex items-end rounded-xl p-3">
        <TextareaAutosize
          ref={textareaRef}
          placeholder="输入您的消息..."
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          minRows={1}
          maxRows={5}
        />
        <Button 
          type="submit" 
          className="ml-2 gradient-btn rounded-xl aspect-square p-2" 
          disabled={isSubmitting || !input.trim()}
          aria-label="发送消息"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
      <div className="text-xs text-right mt-1 opacity-60">
        按 <kbd className="px-1 rounded border">Enter</kbd> 发送，<kbd className="px-1 rounded border">Shift</kbd>+<kbd className="px-1 rounded border">Enter</kbd> 换行
      </div>
    </form>
  );
} 