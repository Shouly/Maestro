import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function WelcomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  
  const steps = [
    {
      title: "欢迎使用 Maestro",
      description: "您的AI驱动计算机控制助手",
      content: (
        <div className="text-center">
          <p className="mb-6">
            Maestro允许您通过自然语言指令让AI代理执行复杂的计算机操作任务，包括屏幕交互、命令执行和文本编辑等。
          </p>
          <p className="mb-6">
            在接下来的几个步骤中，我们将帮助您完成初始设置，以便您可以开始使用Maestro。
          </p>
        </div>
      ),
    },
    {
      title: "设置API密钥",
      description: "连接到Claude AI模型",
      content: (
        <div>
          <p className="mb-4">
            Maestro使用Anthropic的Claude AI模型。您需要提供一个有效的API密钥才能使用此功能。
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="api-key">
              Anthropic API 密钥
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入您的 API 密钥"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            如果您还没有API密钥，可以访问 <a href="https://console.anthropic.com/" className="text-primary underline" target="_blank" rel="noopener noreferrer">Anthropic控制台</a> 获取。
          </p>
        </div>
      ),
    },
    {
      title: "准备就绪",
      description: "开始使用Maestro",
      content: (
        <div className="text-center">
          <p className="mb-6">
            恭喜！您已完成Maestro的初始设置。
          </p>
          <p className="mb-6">
            现在您可以开始使用Maestro，通过自然语言控制您的计算机。
          </p>
          <p>
            如果您需要更改设置，可以随时访问设置页面。
          </p>
        </div>
      ),
    },
  ];
  
  const handleNext = () => {
    if (step === steps.length - 1) {
      // 完成设置，保存API密钥并导航到主页
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("hasCompletedOnboarding", "true");
      navigate("/");
    } else {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const currentStep = steps[step];
  
  return (
    <div className="flex h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-lg border p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{currentStep.title}</h1>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </div>
        
        <div className="mb-8">
          {currentStep.content}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50"
          >
            上一步
          </button>
          
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {step === steps.length - 1 ? "完成" : "下一步"}
          </button>
        </div>
      </div>
    </div>
  );
} 