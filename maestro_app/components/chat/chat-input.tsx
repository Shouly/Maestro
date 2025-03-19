'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-2">
          <Input 
            placeholder="输入您的问题..." 
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            className="bg-primary hover:bg-primary-600"
            type="submit"
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? "发送中..." : "发送"}
          </Button>
        </div>
        <div className="mt-2 flex justify-between">
          <div className="text-sm text-[var(--color-muted-foreground)]">
            模型：未选择
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            选择模型
          </Button>
        </div>
      </form>
    </div>
  );
} 