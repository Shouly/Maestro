import { invoke } from '@tauri-apps/api/core';
import { BackgroundProcess } from "./types";

/**
 * 命令执行服务，用于调用BashTool的功能
 */
export class BashService {
  /**
   * 执行命令
   * @param command 命令
   * @returns 命令输出
   */
  static async executeCommand(command: string): Promise<string> {
    try {
      return await invoke("execute_command", { command });
    } catch (error) {
      console.error("执行命令失败:", error);
      throw error;
    }
  }

  /**
   * 异步执行命令
   * @param command 命令
   * @returns 命令ID
   */
  static async executeCommandAsync(command: string): Promise<string> {
    try {
      return await invoke("execute_command_async", { command });
    } catch (error) {
      console.error("异步执行命令失败:", error);
      throw error;
    }
  }

  /**
   * 后台执行命令
   * @param command 命令
   * @returns 进程ID
   */
  static async executeCommandBackground(command: string): Promise<string> {
    try {
      return await invoke("execute_command_background", { command });
    } catch (error) {
      console.error("后台执行命令失败:", error);
      throw error;
    }
  }

  /**
   * 获取后台进程列表
   */
  static async listBackgroundProcesses(): Promise<BackgroundProcess[]> {
    try {
      return await invoke("list_background_processes");
    } catch (error) {
      console.error("获取后台进程列表失败:", error);
      throw error;
    }
  }

  /**
   * 终止后台进程
   * @param id 进程ID
   */
  static async terminateBackgroundProcess(id: string): Promise<void> {
    try {
      await invoke("terminate_background_process", { id });
    } catch (error) {
      console.error("终止后台进程失败:", error);
      throw error;
    }
  }

  /**
   * 获取环境变量
   */
  static async getEnvironmentVariables(): Promise<Record<string, string>> {
    try {
      return await invoke("get_environment_variables");
    } catch (error) {
      console.error("获取环境变量失败:", error);
      throw error;
    }
  }

  /**
   * 获取当前目录
   */
  static async getCurrentDirectory(): Promise<string> {
    try {
      return await invoke("get_current_directory");
    } catch (error) {
      console.error("获取当前目录失败:", error);
      throw error;
    }
  }

  /**
   * 检查命令是否存在
   * @param command 命令
   */
  static async checkCommandExists(command: string): Promise<boolean> {
    try {
      return await invoke("check_command_exists", { command });
    } catch (error) {
      console.error("检查命令是否存在失败:", error);
      throw error;
    }
  }

  /**
   * 获取命令历史
   */
  static async getCommandHistory(): Promise<string[]> {
    try {
      return await invoke("get_command_history");
    } catch (error) {
      console.error("获取命令历史失败:", error);
      throw error;
    }
  }

  /**
   * 搜索命令历史
   * @param query 搜索关键词
   */
  static async searchCommandHistory(query: string): Promise<string[]> {
    try {
      return await invoke("search_command_history", { query });
    } catch (error) {
      console.error("搜索命令历史失败:", error);
      throw error;
    }
  }

  /**
   * 重新运行命令
   * @param index 命令索引
   */
  static async rerunCommand(index: number): Promise<string> {
    try {
      return await invoke("rerun_command", { index });
    } catch (error) {
      console.error("重新运行命令失败:", error);
      throw error;
    }
  }

  /**
   * 启动Bash会话
   */
  static async startBashSession(): Promise<string> {
    try {
      return await invoke("start_bash_session");
    } catch (error) {
      console.error("启动Bash会话失败:", error);
      throw error;
    }
  }

  /**
   * 停止Bash会话
   */
  static async stopBashSession(): Promise<void> {
    try {
      await invoke("stop_bash_session");
    } catch (error) {
      console.error("停止Bash会话失败:", error);
      throw error;
    }
  }

  /**
   * 重启Bash会话
   */
  static async restartBashSession(): Promise<string> {
    try {
      return await invoke("restart_bash_session");
    } catch (error) {
      console.error("重启Bash会话失败:", error);
      throw error;
    }
  }

  /**
   * 在会话中执行命令
   * @param command 命令
   */
  static async executeInSession(command: string): Promise<string> {
    try {
      return await invoke("execute_in_session", { command });
    } catch (error) {
      console.error("在会话中执行命令失败:", error);
      throw error;
    }
  }
} 