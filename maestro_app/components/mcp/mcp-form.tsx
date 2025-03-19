'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface MCPFormProps {
  onSubmit?: (data: {
    name: string;
    url: string;
    apiKey: string;
    enabled: boolean;
  }) => void;
  isLoading?: boolean;
}

export default function MCPForm({ onSubmit, isLoading = false }: MCPFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    apiKey: '',
    enabled: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, enabled: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && formData.name && formData.url) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          服务器名称
        </label>
        <Input 
          placeholder="例如：我的本地 MCP 服务器" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          服务器 URL
        </label>
        <Input 
          placeholder="例如：http://localhost:8000" 
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          API 密钥（如需要）
        </label>
        <Input 
          placeholder="可选：输入服务器API密钥" 
          type="password"
          name="apiKey"
          value={formData.apiKey}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="mcp-enabled"
          checked={formData.enabled}
          onCheckedChange={handleSwitchChange}
        />
        <label htmlFor="mcp-enabled" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          启用此 MCP 服务器
        </label>
      </div>

      <div className="pt-2">
        <Button 
          className="bg-[#0090FF] hover:bg-blue-600"
          type="submit"
          disabled={isLoading || !formData.name || !formData.url}
        >
          {isLoading ? "保存中..." : "保存 MCP 服务器"}
        </Button>
      </div>
    </form>
  );
} 