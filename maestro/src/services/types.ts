// 工具输出类型
export type ToolOutputType = "screenshot" | "command" | "text" | "none";

// 工具输出结果
export interface ToolOutput {
  type: ToolOutputType;
  content: string;
  error?: string;
}

// 消息类型
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  toolOutputs?: ToolOutput[];
  thinking?: any[];
}

// 会话类型
export interface Session {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// AI模型类型
export type ModelType = "claude-3-7-sonnet-latest";

// 系统信息类型
export interface SystemInfo {
  os: string;
  hostname: string;
  username: string;
  cpuCores: number;
  totalMemory: number;
  freeMemory: number;
}

// 鼠标按钮类型
export type MouseButton = "left" | "right" | "middle";

// 鼠标滚动方向
export type ScrollDirection = "up" | "down" | "left" | "right";

// 坐标类型
export interface Coordinates {
  x: number;
  y: number;
}

// 文件信息类型
export interface FileInfo {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  modifiedTime: number;
}

// 进程信息类型
export interface ProcessInfo {
  pid: number;
  name: string;
  cpuUsage: number;
  memoryUsage: number;
  status: string;
}

// 后台进程类型
export interface BackgroundProcess {
  id: string;
  command: string;
  pid: number;
  startTime: number;
  status: "running" | "completed" | "failed";
} 