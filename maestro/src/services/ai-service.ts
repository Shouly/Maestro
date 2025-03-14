import { Message, ModelType, ToolOutput, ToolOutputType } from "./types";
import { ComputerService } from "./computer-service";
import { BashService } from "./bash-service";
import { EditService } from "./edit-service";

/**
 * AI通信服务，用于与Claude API通信
 */
export class AIService {
  private static apiKey: string = "";
  private static model: ModelType = "claude-3-sonnet-20240229";
  private static apiEndpoint: string = "https://api.anthropic.com/v1/messages";
  private static systemPrompt: string = `You are Maestro, an AI-powered computer control assistant. You can help users control their computer, perform various tasks, including screen interactions, command execution, and text editing.

You are running in a cross-platform desktop application with access to the user's computer system. Please use these permissions carefully and always ask for user confirmation for potentially risky operations.

When you need to perform operations, use the provided tools rather than describing how to perform the operations.`;

  /**
   * 设置API密钥
   * @param apiKey API密钥
   */
  static setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem("apiKey", apiKey);
  }

  /**
   * 获取API密钥
   */
  static getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem("apiKey") || "";
    }
    return this.apiKey;
  }

  /**
   * 设置模型
   * @param model 模型
   */
  static setModel(model: ModelType): void {
    this.model = model;
    localStorage.setItem("model", model);
  }

  /**
   * 获取模型
   */
  static getModel(): ModelType {
    if (!this.model) {
      const savedModel = localStorage.getItem("model");
      this.model = (savedModel as ModelType) || "claude-3-sonnet-20240229";
    }
    return this.model;
  }

  /**
   * 设置系统提示词
   * @param prompt 系统提示词
   */
  static setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
    localStorage.setItem("systemPrompt", prompt);
  }

  /**
   * 获取系统提示词
   */
  static getSystemPrompt(): string {
    const savedPrompt = localStorage.getItem("systemPrompt");
    return savedPrompt || this.systemPrompt;
  }

  /**
   * 获取工具定义
   */
  private static getToolDefinitions() {
    return [
      {
        name: "computer",
        description: "控制计算机屏幕、鼠标和键盘的工具",
        input_schema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: [
                "screenshot",
                "mouse_move",
                "left_click",
                "right_click",
                "middle_click",
                "double_click",
                "triple_click",
                "left_mouse_down",
                "left_mouse_up",
                "left_click_drag",
                "scroll",
                "type",
                "key",
                "hold_key",
                "wait",
                "cursor_position"
              ],
              description: "要执行的操作类型"
            },
            x: {
              type: "number",
              description: "鼠标X坐标"
            },
            y: {
              type: "number",
              description: "鼠标Y坐标"
            },
            text: {
              type: "string",
              description: "要输入的文本"
            },
            key: {
              type: "string",
              description: "要按下的键"
            },
            direction: {
              type: "string",
              enum: ["up", "down", "left", "right"],
              description: "滚动方向"
            },
            amount: {
              type: "number",
              description: "滚动量"
            },
            duration_ms: {
              type: "number",
              description: "等待时间（毫秒）"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "bash",
        description: "执行系统命令的工具",
        input_schema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "要执行的命令"
            },
            timeout_ms: {
              type: "number",
              description: "命令超时时间（毫秒）"
            },
            background: {
              type: "boolean",
              description: "是否在后台运行"
            }
          },
          required: ["command"]
        }
      },
      {
        name: "edit",
        description: "读取和编辑文件的工具",
        input_schema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["read", "write", "append", "list", "search", "replace"],
              description: "要执行的操作类型"
            },
            path: {
              type: "string",
              description: "文件或目录路径"
            },
            content: {
              type: "string",
              description: "要写入的内容"
            },
            pattern: {
              type: "string",
              description: "搜索模式"
            },
            replacement: {
              type: "string",
              description: "替换内容"
            },
            start_line: {
              type: "number",
              description: "起始行号"
            },
            end_line: {
              type: "number",
              description: "结束行号"
            }
          },
          required: ["action", "path"]
        }
      }
    ];
  }

  /**
   * 发送消息到Claude API
   * @param messages 消息历史
   * @param systemPrompt 系统提示词
   * @returns AI响应和工具调用结果
   */
  static async sendMessage(
    messages: Message[],
    systemPrompt?: string
  ): Promise<{ message: Message, toolResults: ToolOutput[] }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("API密钥未设置");
    }

    try {
      // 转换消息格式为Claude API格式
      const claudeMessages = messages.map((msg) => {
        if (msg.toolOutputs && msg.toolOutputs.length > 0) {
          // 如果消息包含工具输出，将其转换为工具结果格式
          return {
            role: msg.role,
            content: msg.toolOutputs.map(output => {
              if (output.type === "screenshot") {
                return {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/png",
                    data: output.content
                  }
                };
              } else {
                return {
                  type: "text",
                  text: output.content
                };
              }
            })
          };
        } else {
          // 普通文本消息
          return {
            role: msg.role,
            content: [
              {
                type: "text",
                text: msg.content
              }
            ]
          };
        }
      });

      // 构建请求体
      const requestBody = {
        model: this.getModel(),
        messages: claudeMessages,
        system: systemPrompt || this.getSystemPrompt(),
        max_tokens: 4000,
        tools: this.getToolDefinitions()
      };

      // 发送请求
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API请求失败: ${response.status} ${errorData.error?.message || "未知错误"}`
        );
      }

      const data = await response.json();
      
      // 提取文本内容和工具调用
      let textContent = "";
      const toolCalls: any[] = [];
      
      for (const block of data.content) {
        if (block.type === "text") {
          textContent += block.text;
        } else if (block.type === "tool_use") {
          toolCalls.push({
            tool: block.name,
            id: block.id,
            args: block.input
          });
        }
      }

      // 构建响应消息
      const responseMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: textContent,
        timestamp: Date.now(),
      };

      // 执行工具调用
      const toolResults: ToolOutput[] = [];
      if (toolCalls.length > 0) {
        for (const call of toolCalls) {
          const result = await this.executeToolCall(call.tool, call.args);
          toolResults.push(result);
        }
      }

      return { message: responseMessage, toolResults };
    } catch (error) {
      console.error("发送消息到Claude API失败:", error);
      throw error;
    }
  }

  /**
   * 执行工具调用
   * @param tool 工具名称
   * @param args 工具参数
   * @returns 工具输出
   */
  static async executeToolCall(tool: string, args: any): Promise<ToolOutput> {
    try {
      switch (tool) {
        case "computer":
          return await this.executeComputerTool(args);
        case "bash":
          return await this.executeBashTool(args);
        case "edit":
          return await this.executeEditTool(args);
        default:
          return {
            type: "text",
            content: `未知工具: ${tool}`
          };
      }
    } catch (error) {
      console.error(`执行工具 ${tool} 失败:`, error);
      return {
        type: "text",
        content: `执行工具 ${tool} 失败: ${error}`,
        error: String(error)
      };
    }
  }

  /**
   * 执行计算机控制工具
   * @param args 工具参数
   * @returns 工具输出
   */
  private static async executeComputerTool(args: any): Promise<ToolOutput> {
    const { action } = args;
    
    switch (action) {
      case "screenshot":
        const screenshot = await ComputerService.takeScreenshot();
        return {
          type: "screenshot",
          content: screenshot
        };
      case "mouse_move":
        await ComputerService.moveMouse(args.x, args.y);
        return {
          type: "text",
          content: `已将鼠标移动到 (${args.x}, ${args.y})`
        };
      case "left_click":
        await ComputerService.click("left", args.x, args.y);
        return {
          type: "text",
          content: `已在 (${args.x}, ${args.y}) 处执行左键点击`
        };
      case "right_click":
        await ComputerService.click("right", args.x, args.y);
        return {
          type: "text",
          content: `已在 (${args.x}, ${args.y}) 处执行右键点击`
        };
      case "middle_click":
        await ComputerService.click("middle", args.x, args.y);
        return {
          type: "text",
          content: `已在 (${args.x}, ${args.y}) 处执行中键点击`
        };
      case "double_click":
        await ComputerService.doubleClick(args.x, args.y);
        return {
          type: "text",
          content: `已在 (${args.x}, ${args.y}) 处执行双击`
        };
      case "triple_click":
        await ComputerService.tripleClick(args.x, args.y);
        return {
          type: "text",
          content: `已在 (${args.x}, ${args.y}) 处执行三击`
        };
      case "left_mouse_down":
        await ComputerService.mouseDownAt(args.x, args.y);
        return {
          type: "text",
          content: `已在 (${args.x}, ${args.y}) 处按下鼠标左键`
        };
      case "left_mouse_up":
        await ComputerService.mouseUpAt(args.x, args.y);
        return {
          type: "text",
          content: `已在 (${args.x}, ${args.y}) 处释放鼠标左键`
        };
      case "left_click_drag":
        await ComputerService.dragMouse(args.x, args.y, args.end_x, args.end_y);
        return {
          type: "text",
          content: `已从 (${args.x}, ${args.y}) 拖动到 (${args.end_x}, ${args.end_y})`
        };
      case "scroll":
        await ComputerService.scroll(args.direction, args.amount || 3);
        return {
          type: "text",
          content: `已向${args.direction}滚动${args.amount || 3}次`
        };
      case "type":
        await ComputerService.typeText(args.text);
        return {
          type: "text",
          content: `已输入文本: ${args.text.substring(0, 20)}${args.text.length > 20 ? '...' : ''}`
        };
      case "key":
        await ComputerService.pressKey(args.key);
        return {
          type: "text",
          content: `已按下按键: ${args.key}`
        };
      case "hold_key":
        if (args.down === true) {
          await ComputerService.keyDown(args.key);
          return {
            type: "text",
            content: `已按下并保持按键: ${args.key}`
          };
        } else {
          await ComputerService.keyUp(args.key);
          return {
            type: "text",
            content: `已释放按键: ${args.key}`
          };
        }
      case "wait":
        await ComputerService.wait(args.duration_ms || 1000);
        return {
          type: "text",
          content: `已等待 ${args.duration_ms || 1000} 毫秒`
        };
      case "cursor_position":
        const position = await ComputerService.getCursorPosition();
        return {
          type: "text",
          content: `当前光标位置: (${position.x}, ${position.y})`
        };
      default:
        throw new Error(`未知的计算机操作: ${action}`);
    }
  }

  /**
   * 执行命令行工具
   * @param args 工具参数
   * @returns 工具输出
   */
  private static async executeBashTool(args: any): Promise<ToolOutput> {
    const { command, timeout_ms, background } = args;
    
    let result: string;
    
    if (background) {
      // 如果需要在后台运行，使用后台执行命令的方法
      const processId = await BashService.executeCommandBackground(command);
      result = `命令已在后台启动，进程ID: ${processId}`;
    } else {
      // 否则使用普通执行命令的方法
      result = await BashService.executeCommand(command);
    }
    
    return {
      type: "command",
      content: result
    };
  }

  /**
   * 执行文本编辑工具
   * @param args 工具参数
   * @returns 工具输出
   */
  private static async executeEditTool(args: any): Promise<ToolOutput> {
    const { action, path } = args;
    
    switch (action) {
      case "read":
        const content = await EditService.readFileContent(path);
        return {
          type: "text",
          content
        };
      case "write":
        await EditService.writeFileContent(path, args.content);
        return {
          type: "text",
          content: `已写入文件: ${path}`
        };
      case "append":
        await EditService.appendFileContent(path, args.content);
        return {
          type: "text",
          content: `已追加到文件: ${path}`
        };
      case "list":
        const files = await EditService.listDirectory(path);
        const fileList = files.map(file => 
          `${file.name}${file.isDirectory ? '/' : ''} (${file.size} bytes)`
        ).join('\n');
        return {
          type: "text",
          content: fileList
        };
      case "search":
        const searchResults = await EditService.searchFiles(path, args.pattern);
        return {
          type: "text",
          content: searchResults.join('\n')
        };
      case "replace":
        await EditService.strReplace(path, args.pattern, args.replacement);
        return {
          type: "text",
          content: `已在文件 ${path} 中将 "${args.pattern}" 替换为 "${args.replacement}"`
        };
      default:
        throw new Error(`未知的编辑操作: ${action}`);
    }
  }
} 