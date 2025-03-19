'use client';

import { useState, useEffect, useRef } from "react";
import ChatInput from "@/components/chat/chat-input";
import Image from "next/image";
import { useAuth } from "@/lib/auth-provider";

// 定义消息类型接口
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // 当消息列表变化时滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {/* 头部欢迎区域 */}
      <div className="p-6 border-b border-border-40">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-2xl font-bold text-gradient mb-2">
            欢迎回来，{user?.name || '用户'}
          </h1>
          <p className="text-base-80">
            今天我能帮您做什么？请随时向我提问或要求我执行任务。
          </p>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="relative w-[150px] h-[150px]">
              <Image
                src="/maestro-logo.svg"
                alt="Maestro Logo"
                width={150}
                height={150}
                className="opacity-70"
              />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--color-primary-light),0.4)_0%,transparent_70%)] blur-xl -z-[1]"></div>
            </div>
            <h2 className="text-xl font-semibold text-center text-gradient">
              开始与人工智能助手对话
            </h2>
            <p className="text-center max-w-md text-base-80">
              Maestro 是您的智能助手，可以帮助您回答问题、生成内容、分析数据等。
              <br />
              输入您的问题开始对话吧！
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-screen-lg mx-auto pb-20">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="max-w-screen-lg mx-auto glassmorphism rounded-xl">
          <ChatInput onSendMessage={addMessage} />
        </div>
      </div>
    </div>
  );
} 