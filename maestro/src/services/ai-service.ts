import { Message, ModelType, ToolOutput, ToolOutputType } from "./types";
import { ComputerService } from "./computer-service";
import { BashService } from "./bash-service";
import { EditService } from "./edit-service";
import Anthropic from '@anthropic-ai/sdk';
import { Tool, MessageParam, ContentBlockParam } from "@anthropic-ai/sdk/resources/messages";

/**
 * AI通信服务，用于与Claude API通信
 */
export class AIService {
  private static apiKey: string = "";
  private static model: ModelType = "claude-3-sonnet-20240229";
  private static systemPrompt: string = `<SYSTEM_CAPABILITY>
* You are Maestro, an AI-powered computer control assistant. You can help users control their computer, perform various tasks, including screen interactions, command execution, and text editing.
* You are running in a cross-platform desktop application with access to the user's computer system. Please use these permissions carefully and always ask for user confirmation for potentially risky operations.
* You can utilize an operating system with internet access.
* You can feel free to install applications with your bash tool. Use curl instead of wget when possible.
* To open browsers, please just click on the browser icon.
* Using bash tool you can start GUI applications, but you may need to set appropriate display environment variables.
* When using your bash tool with commands that are expected to output very large quantities of text, redirect into a tmp file and use edit tool or grep to confirm output.
* When viewing a page it can be helpful to zoom out so that you can see everything on the page. Either that, or make sure you scroll down to see everything before deciding something isn't available.
* When using your computer function calls, they take a while to run and send back to you. Where possible/feasible, try to chain multiple of these calls all into one function calls request.
* The current date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
</SYSTEM_CAPABILITY>

<IMPORTANT>
* When using browsers, if a startup wizard appears, IGNORE IT. Do not even click "skip this step". Instead, click on the address bar where it says "Search or enter address", and enter the appropriate search term or URL there.
* If the item you are looking at is a pdf, if after taking a single screenshot of the pdf it seems that you want to read the entire document instead of trying to continue to read the pdf from your screenshots + navigation, determine the URL, use curl to download the pdf, install and use appropriate tools to convert it to a text file, and then read that text file directly with your edit tool.
</IMPORTANT>`;

  // 工具版本和beta标志
  private static toolVersion: "computer_use_20241022" | "computer_use_20250124" = "computer_use_20241022";
  private static betaFlags: Record<string, string> = {
    "computer_use_20241022": "computer-use-2024-10-22",
    "computer_use_20250124": "computer-use-2025-01-24"
  };
  // 是否启用token高效工具
  private static enableTokenEfficientTools: boolean = true;

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
   * 设置工具版本
   * @param version 工具版本
   */
  static setToolVersion(version: "computer_use_20241022" | "computer_use_20250124"): void {
    this.toolVersion = version;
    localStorage.setItem("toolVersion", version);
  }

  /**
   * 获取工具版本
   */
  static getToolVersion(): "computer_use_20241022" | "computer_use_20250124" {
    const savedVersion = localStorage.getItem("toolVersion");
    if (savedVersion === "computer_use_20241022" || savedVersion === "computer_use_20250124") {
      return savedVersion;
    }
    return this.toolVersion;
  }

  /**
   * 设置是否启用token高效工具
   * @param enable 是否启用
   */
  static setEnableTokenEfficientTools(enable: boolean): void {
    this.enableTokenEfficientTools = enable;
    localStorage.setItem("enableTokenEfficientTools", enable.toString());
  }

  /**
   * 获取是否启用token高效工具
   */
  static getEnableTokenEfficientTools(): boolean {
    const savedValue = localStorage.getItem("enableTokenEfficientTools");
    if (savedValue !== null) {
      return savedValue === "true";
    }
    return this.enableTokenEfficientTools;
  }

  /**
   * 获取当前工具版本的beta标志
   */
  static getBetaFlag(): string {
    const flags: string[] = [this.betaFlags[this.getToolVersion()]];
    
    // 如果启用token高效工具，添加对应的beta标志
    if (this.getEnableTokenEfficientTools() && this.getModel() === "claude-3-7-sonnet-20250219") {
      flags.push("token-efficient-tools-2025-02-19");
    }
    
    return flags.join(",");
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
  private static getToolDefinitions(): Tool[] {
    return [
      {
        name: "computer",
        description: "Control computer screen, mouse, and keyboard",
        input_schema: {
          type: "object" as const,
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
              description: "Type of action to perform"
            },
            x: {
              type: "number",
              description: "Mouse X coordinate"
            },
            y: {
              type: "number",
              description: "Mouse Y coordinate"
            },
            text: {
              type: "string",
              description: "Text to type"
            },
            key: {
              type: "string",
              description: "Key to press"
            },
            direction: {
              type: "string",
              enum: ["up", "down", "left", "right"],
              description: "Scroll direction"
            },
            amount: {
              type: "number",
              description: "Scroll amount"
            },
            duration_ms: {
              type: "number",
              description: "Wait duration in milliseconds"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "bash",
        description: "Execute system commands",
        input_schema: {
          type: "object" as const,
          properties: {
            command: {
              type: "string",
              description: "Command to execute"
            },
            timeout_ms: {
              type: "number",
              description: "Command timeout in milliseconds"
            },
            background: {
              type: "boolean",
              description: "Whether to run in background"
            }
          },
          required: ["command"]
        }
      },
      {
        name: "edit",
        description: "Read and edit files",
        input_schema: {
          type: "object" as const,
          properties: {
            action: {
              type: "string",
              enum: ["read", "write", "append", "list", "search", "replace"],
              description: "Type of action to perform"
            },
            path: {
              type: "string",
              description: "File or directory path"
            },
            content: {
              type: "string",
              description: "Content to write"
            },
            pattern: {
              type: "string",
              description: "Search pattern"
            },
            replacement: {
              type: "string",
              description: "Replacement text"
            },
            start_line: {
              type: "number",
              description: "Start line number"
            },
            end_line: {
              type: "number",
              description: "End line number"
            }
          },
          required: ["action", "path"]
        }
      }
    ];
  }

  /**
   * 为消息注入提示缓存控制
   * @param messages 消息历史
   */
  private static injectPromptCaching(messages: Message[]): void {
    // 提示缓存现在是GA功能，不再需要在消息中添加cache_control属性
    // 缓存控制现在由API自动处理
    // 此方法保留但不执行任何操作
  }

  /**
   * 发送消息到Claude API并处理工具调用循环
   * @param messages 消息历史
   * @param systemPrompt 系统提示词
   * @param onlyNMostRecentImages 只保留最近的N张图像，为0或undefined时不过滤
   * @param thinkingBudget 思考预算，为undefined时不启用思考
   * @param enablePromptCaching 是否启用提示缓存
   * @returns 更新后的消息历史
   */
  static async sendMessage(
    messages: Message[],
    systemPrompt?: string,
    onlyNMostRecentImages?: number,
    thinkingBudget?: number,
    enablePromptCaching: boolean = true
  ): Promise<Message[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("API key not set");
    }

    try {
      // 创建Anthropic客户端
      const client = new Anthropic({
        apiKey: apiKey,
        defaultHeaders: {
          "anthropic-beta": this.getBetaFlag()
        },
        dangerouslyAllowBrowser: true // 允许在浏览器环境中运行
      });

      // 如果启用提示缓存，添加缓存控制（提示缓存已正式发布，不再需要beta标志）
      if (enablePromptCaching) {
        // 提示缓存现在是GA功能，不再需要显式调用injectPromptCaching
        // 因为缓存读取的价格是10%，我们认为通过截断图像来破坏缓存是不明智的
        onlyNMostRecentImages = 0;
      }

      // 如果指定了图像数量限制，过滤消息中的图像
      if (onlyNMostRecentImages) {
        this.filterRecentImages(messages, onlyNMostRecentImages);
      }

      // 转换消息格式为Claude API格式
      const claudeMessages: MessageParam[] = messages.map((msg) => {
        // 普通文本消息
        if (!msg.toolOutputs || msg.toolOutputs.length === 0) {
          const messageParam: MessageParam = {
            role: msg.role,
            content: msg.content
          };
          
          // 不再添加cache_control属性
          return messageParam;
        }
        
        // 处理包含工具输出的消息
        const contentBlocks: ContentBlockParam[] = [];
        
        for (const output of msg.toolOutputs) {
          if (output.type === "screenshot") {
            contentBlocks.push({
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png" as "image/png",
                data: output.content
              }
            });
          } else {
            contentBlocks.push({
              type: "text",
              text: output.content
            });
          }
        }
        
        const messageParam: MessageParam = {
          role: msg.role,
          content: contentBlocks
        };
        
        // 不再添加cache_control属性
        return messageParam;
      });

      // 主循环 - 类似Python版本的sampling_loop
      while (true) {
        // 准备API调用参数
        const apiParams: any = {
          model: this.getModel(),
          messages: claudeMessages,
          system: systemPrompt || this.getSystemPrompt(),
          max_tokens: 4000,
          tools: this.getToolDefinitions(),
        };
        
        // 如果有思考预算，添加思考参数
        if (thinkingBudget) {
          apiParams.thinking = {
            budget: thinkingBudget
          };
        }
        
        // 调用Claude API
        const response = await client.messages.create(apiParams);
        
        // 提取文本内容和工具调用
        let textContent = "";
        const toolCalls: any[] = [];
        const thinkingContent: any[] = [];
        
        for (const block of response.content) {
          if (block.type === "text") {
            textContent += block.text;
          } else if (block.type === "tool_use") {
            toolCalls.push({
              tool: block.name,
              id: block.id,
              args: block.input
            });
          } else if (block.type === "thinking") {
            // 处理思考块
            thinkingContent.push(block);
          }
        }

        // 构建响应消息
        const responseMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: textContent,
          timestamp: Date.now(),
          thinking: thinkingContent.length > 0 ? thinkingContent : undefined
        };

        // 添加助手消息到历史
        messages.push(responseMessage);

        // 如果没有工具调用，退出循环
        if (toolCalls.length === 0) {
          return messages;
        }

        // 执行工具调用
        const toolResults: ToolOutput[] = [];
        for (const call of toolCalls) {
          const result = await this.executeToolCall(call.tool, call.args);
          toolResults.push(result);
        }

        // 创建包含工具结果的用户消息
        const toolResultMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: "",
          timestamp: Date.now(),
          toolOutputs: toolResults
        };

        // 添加工具结果消息到历史
        messages.push(toolResultMessage);
        
        // 更新claudeMessages以包含新消息
        claudeMessages.push({
          role: "assistant",
          content: textContent
        });
        
        // 添加工具结果消息
        const toolResultBlocks: ContentBlockParam[] = [];
        for (const result of toolResults) {
          if (result.type === "screenshot") {
            toolResultBlocks.push({
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png" as "image/png",
                data: result.content
              }
            });
          } else {
            toolResultBlocks.push({
              type: "text",
              text: result.content
            });
          }
        }
        
        claudeMessages.push({
          role: "user",
          content: toolResultBlocks
        });
      }
    } catch (error) {
      console.error("Failed to send message to Claude API:", error);
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
            content: `Unknown tool: ${tool}`
          };
      }
    } catch (error) {
      console.error(`Failed to execute tool ${tool}:`, error);
      return {
        type: "text",
        content: `Failed to execute tool ${tool}: ${error}`,
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
          content: `Moved mouse to (${args.x}, ${args.y})`
        };
      case "left_click":
        await ComputerService.click("left", args.x, args.y);
        return {
          type: "text",
          content: `Left clicked at (${args.x}, ${args.y})`
        };
      case "right_click":
        await ComputerService.click("right", args.x, args.y);
        return {
          type: "text",
          content: `Right clicked at (${args.x}, ${args.y})`
        };
      case "middle_click":
        await ComputerService.click("middle", args.x, args.y);
        return {
          type: "text",
          content: `Middle clicked at (${args.x}, ${args.y})`
        };
      case "double_click":
        await ComputerService.doubleClick(args.x, args.y);
        return {
          type: "text",
          content: `Double clicked at (${args.x}, ${args.y})`
        };
      case "triple_click":
        await ComputerService.tripleClick(args.x, args.y);
        return {
          type: "text",
          content: `Triple clicked at (${args.x}, ${args.y})`
        };
      case "left_mouse_down":
        await ComputerService.mouseDownAt(args.x, args.y);
        return {
          type: "text",
          content: `Mouse down at (${args.x}, ${args.y})`
        };
      case "left_mouse_up":
        await ComputerService.mouseUpAt(args.x, args.y);
        return {
          type: "text",
          content: `Mouse up at (${args.x}, ${args.y})`
        };
      case "left_click_drag":
        await ComputerService.dragMouse(args.x, args.y, args.end_x, args.end_y);
        return {
          type: "text",
          content: `Dragged from (${args.x}, ${args.y}) to (${args.end_x}, ${args.end_y})`
        };
      case "scroll":
        await ComputerService.scroll(args.direction, args.amount || 3);
        return {
          type: "text",
          content: `Scrolled ${args.direction} ${args.amount || 3} times`
        };
      case "type":
        await ComputerService.typeText(args.text);
        return {
          type: "text",
          content: `Typed text: ${args.text.substring(0, 20)}${args.text.length > 20 ? '...' : ''}`
        };
      case "key":
        await ComputerService.pressKey(args.key);
        return {
          type: "text",
          content: `Pressed key: ${args.key}`
        };
      case "hold_key":
        if (args.down === true) {
          await ComputerService.keyDown(args.key);
          return {
            type: "text",
            content: `Key down: ${args.key}`
          };
        } else {
          await ComputerService.keyUp(args.key);
          return {
            type: "text",
            content: `Key up: ${args.key}`
          };
        }
      case "wait":
        await ComputerService.wait(args.duration_ms || 1000);
        return {
          type: "text",
          content: `Waited for ${args.duration_ms || 1000} ms`
        };
      case "cursor_position":
        const position = await ComputerService.getCursorPosition();
        return {
          type: "text",
          content: `Cursor position: (${position.x}, ${position.y})`
        };
      default:
        throw new Error(`Unknown computer action: ${action}`);
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
      result = `Command started in background, process ID: ${processId}`;
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
          content: `File written: ${path}`
        };
      case "append":
        await EditService.appendFileContent(path, args.content);
        return {
          type: "text",
          content: `Content appended to file: ${path}`
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
          content: `Replaced "${args.pattern}" with "${args.replacement}" in file ${path}`
        };
      default:
        throw new Error(`Unknown edit action: ${action}`);
    }
  }

  /**
   * 过滤消息中的图像，只保留最近的N张
   * @param messages 消息历史
   * @param imagesToKeep 要保留的图像数量
   * @param minRemovalThreshold 最小移除阈值
   */
  private static filterRecentImages(
    messages: Message[],
    imagesToKeep: number,
    minRemovalThreshold: number = 3
  ): void {
    if (!imagesToKeep) return;

    // 收集所有包含截图的消息
    const messagesWithScreenshots = messages.filter(
      (msg) => msg.toolOutputs && msg.toolOutputs.some((output) => output.type === "screenshot")
    );

    // 计算总图像数
    let totalImages = 0;
    for (const msg of messagesWithScreenshots) {
      if (msg.toolOutputs) {
        totalImages += msg.toolOutputs.filter((output) => output.type === "screenshot").length;
      }
    }

    // 计算要移除的图像数
    let imagesToRemove = totalImages - imagesToKeep;
    // 为了更好的缓存行为，我们按块移除
    imagesToRemove -= imagesToRemove % minRemovalThreshold;
    
    if (imagesToRemove <= 0) return;

    // 从最早的消息开始移除图像
    for (const msg of messagesWithScreenshots) {
      if (imagesToRemove <= 0) break;
      
      if (msg.toolOutputs) {
        const newToolOutputs: ToolOutput[] = [];
        
        for (const output of msg.toolOutputs) {
          if (output.type === "screenshot" && imagesToRemove > 0) {
            imagesToRemove--;
            continue;
          }
          newToolOutputs.push(output);
        }
        
        msg.toolOutputs = newToolOutputs;
      }
    }
  }
} 