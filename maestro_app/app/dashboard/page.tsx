'use client';

import { useState, useEffect, useRef } from "react";
import ChatInput from "@/components/chat/chat-input";
import Image from "next/image";
import { useAuth } from "@/lib/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, Send } from "lucide-react";

// 定义消息类型接口
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const addMessage = (message: Omit<Message, 'timestamp'>) => {
    setMessages(prevMessages => [...prevMessages, { ...message, timestamp: Date.now() }]);
  };

  // 当消息列表变化时滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {/* 头部欢迎区域 */}
      <motion.div 
        className="p-8 border-b border-border/10 bg-gradient-to-r from-background via-card to-background"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI助手</span>
            </div>
            <div className="h-6 w-px bg-border/20" />
            <div className="text-base-70">
              {new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-3">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
              欢迎回来
            </span>
            ，{user?.name || '用户'}
          </h1>
          <p className="text-lg text-base-80">
            今天我能帮您做什么？请随时向我提问或要求我执行任务。
          </p>
        </div>
      </motion.div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center h-full space-y-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="size-40 rounded-full bg-gradient-to-br from-primary/10 to-info/10 flex items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-primary" />
                </div>
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-info/20 blur-2xl -z-10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              <div className="text-center space-y-4 max-w-lg">
                <h2 className="text-2xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
                  开始与人工智能助手对话
                </h2>
                <p className="text-lg text-base-80 leading-relaxed">
                  Maestro 是您的智能助手，可以帮助您回答问题、生成内容、分析数据等。
                  <br />
                  输入您的问题开始对话吧！
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6 max-w-screen-lg mx-auto pb-24">
              {messages.map((message, index) => (
                <motion.div 
                  key={message.timestamp}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div 
                    className={`
                      max-w-[80%] rounded-2xl p-4 
                      ${message.role === 'user' 
                        ? 'bg-gradient-to-br from-primary/10 to-info/5 text-foreground' 
                        : 'bg-card shadow-md text-foreground'
                      }
                    `}
                  >
                    <div className="text-base leading-relaxed">{message.content}</div>
                    <div className="mt-2 text-xs text-base-50">
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 输入区域 */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-lg mx-auto">
          <div className="glassmorphism rounded-2xl p-4 border border-border/10">
            <ChatInput onSendMessage={addMessage} />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 