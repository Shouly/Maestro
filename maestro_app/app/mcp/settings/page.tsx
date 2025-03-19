import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function MCPSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            返回仪表板
          </Button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">MCP 服务器设置</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>什么是 MCP 服务器？</CardTitle>
            <CardDescription>
              MCP（Model Context Protocol）服务器允许扩展 AI 模型功能，例如文件访问和数据分析。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              通过配置 MCP 服务器，您可以为您的 AI 助手添加自定义工具扩展，增强其功能。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>添加新 MCP 服务器</CardTitle>
            <CardDescription>
              填写服务器详细信息以添加新的 MCP 服务器连接
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  服务器名称
                </label>
                <Input placeholder="例如：我的本地 MCP 服务器" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  服务器 URL
                </label>
                <Input placeholder="例如：http://localhost:8000" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  API 密钥（如需要）
                </label>
                <Input placeholder="可选：输入服务器API密钥" type="password" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="mcp-enabled" />
                <label htmlFor="mcp-enabled" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  启用此 MCP 服务器
                </label>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="bg-[#0090FF] hover:bg-blue-600">
              保存 MCP 服务器
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>已配置的 MCP 服务器</CardTitle>
            <CardDescription>
              管理您已添加的 MCP 服务器
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 dark:text-slate-400 text-center py-6">
              您尚未配置任何 MCP 服务器
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 