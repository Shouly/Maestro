'use client';

import { useState, useEffect, useRef } from "react";
import ChatInput from "@/components/chat/chat-input";
import Image from "next/image";
import { useAuth } from "@/lib/auth-provider";

export default function DashboardPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const addMessage = (message: any) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // 当消息列表变化时滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {/* 头部欢迎区域 */}
      <div className="panel p-6" style={{
        borderBottom: `1px solid rgba(var(--color-border), 0.5)`
      }}>
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-2xl font-bold text-gradient mb-2">
            欢迎回来，{user?.name || '用户'}
          </h1>
          <p style={{ opacity: 0.8 }}>
            今天我能帮您做什么？请随时向我提问或要求我执行任务。
          </p>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div style={{ 
              position: "relative",
              width: "150px",
              height: "150px"
            }}>
              <Image
                src="/maestro-logo.svg"
                alt="Maestro Logo"
                width={150}
                height={150}
                style={{ opacity: 0.7 }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                borderRadius: "9999px",
                background: `radial-gradient(circle at center, rgba(var(--color-primary-light), 0.4) 0%, transparent 70%)`,
                filter: "blur(20px)",
                zIndex: -1
              }}></div>
            </div>
            <h2 className="text-xl font-semibold text-center text-gradient">
              开始与人工智能助手对话
            </h2>
            <p className="text-center max-w-md" style={{ opacity: 0.8 }}>
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
        <div className="max-w-screen-lg mx-auto">
          <ChatInput onSendMessage={addMessage} />
        </div>
      </div>
    </div>
  );
} 