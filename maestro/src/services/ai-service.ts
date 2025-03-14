import { Message, ModelType, ToolOutput } from "./types";

/**
 * AI通信服务，用于与Claude API通信
 */
export class AIService {
  private static apiKey: string = "";
  private static model: ModelType = "claude-3-sonnet-20240229";
  private static apiEndpoint: string = "https://api.anthropic.com/v1/messages";

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
   * 发送消息到Claude API
   * @param messages 消息历史
   * @param systemPrompt 系统提示词
   * @returns AI响应
   */
  static async sendMessage(
    messages: Message[],
    systemPrompt?: string
  ): Promise<Message> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("API密钥未设置");
    }

    try {
      // 转换消息格式为Claude API格式
      const claudeMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 构建请求体
      const requestBody = {
        model: this.getModel(),
        messages: claudeMessages,
        system: systemPrompt || "",
        max_tokens: 4000,
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

      // 构建响应消息
      const responseMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content[0].text,
        timestamp: Date.now(),
      };

      return responseMessage;
    } catch (error) {
      console.error("发送消息到Claude API失败:", error);
      throw error;
    }
  }

  /**
   * 解析工具调用
   * @param content AI响应内容
   * @returns 工具调用列表
   */
  static parseToolCalls(content: string): { tool: string; args: any }[] {
    // 简单的正则表达式解析工具调用
    // 实际实现可能需要更复杂的解析逻辑
    const toolCallRegex = /\{\{tool:(\w+)\}\}([\s\S]*?)\{\{\/tool\}\}/g;
    const toolCalls: { tool: string; args: any }[] = [];

    let match;
    while ((match = toolCallRegex.exec(content)) !== null) {
      const toolName = match[1];
      const argsString = match[2].trim();
      
      try {
        const args = JSON.parse(argsString);
        toolCalls.push({ tool: toolName, args });
      } catch (error) {
        console.error(`解析工具参数失败: ${argsString}`, error);
      }
    }

    return toolCalls;
  }

  /**
   * 执行工具调用
   * @param toolCalls 工具调用列表
   * @returns 工具输出列表
   */
  static async executeToolCalls(
    toolCalls: { tool: string; args: any }[]
  ): Promise<ToolOutput[]> {
    // 这里只是一个占位实现，实际实现需要根据工具类型调用不同的服务
    const outputs: ToolOutput[] = [];

    for (const call of toolCalls) {
      try {
        // 根据工具类型调用不同的服务
        // 这里需要实现实际的工具调用逻辑
        outputs.push({
          type: "text",
          content: `执行工具 ${call.tool} 成功`,
        });
      } catch (error) {
        console.error(`执行工具 ${call.tool} 失败:`, error);
        outputs.push({
          type: "text",
          content: `执行工具 ${call.tool} 失败: ${error}`,
          error: String(error),
        });
      }
    }

    return outputs;
  }
} 