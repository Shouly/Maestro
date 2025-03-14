import { invoke } from '@tauri-apps/api/core';
import { FileInfo } from "./types";

/**
 * 文件编辑服务，用于调用EditTool的功能
 */
export class EditService {
  /**
   * 读取文件内容
   * @param path 文件路径
   */
  static async readFileContent(path: string): Promise<string> {
    try {
      return await invoke("read_file_content", { path });
    } catch (error) {
      console.error("读取文件内容失败:", error);
      throw error;
    }
  }

  /**
   * 写入文件内容
   * @param path 文件路径
   * @param content 文件内容
   */
  static async writeFileContent(path: string, content: string): Promise<void> {
    try {
      await invoke("write_file_content", { path, content });
    } catch (error) {
      console.error("写入文件内容失败:", error);
      throw error;
    }
  }

  /**
   * 追加文件内容
   * @param path 文件路径
   * @param content 文件内容
   */
  static async appendFileContent(path: string, content: string): Promise<void> {
    try {
      await invoke("append_file_content", { path, content });
    } catch (error) {
      console.error("追加文件内容失败:", error);
      throw error;
    }
  }

  /**
   * 删除文件
   * @param path 文件路径
   */
  static async deleteFile(path: string): Promise<void> {
    try {
      await invoke("delete_file", { path });
    } catch (error) {
      console.error("删除文件失败:", error);
      throw error;
    }
  }

  /**
   * 创建目录
   * @param path 目录路径
   */
  static async createDirectory(path: string): Promise<void> {
    try {
      await invoke("create_directory", { path });
    } catch (error) {
      console.error("创建目录失败:", error);
      throw error;
    }
  }

  /**
   * 获取文件信息
   * @param path 文件路径
   */
  static async getFileInfo(path: string): Promise<FileInfo> {
    try {
      return await invoke("get_file_info", { path });
    } catch (error) {
      console.error("获取文件信息失败:", error);
      throw error;
    }
  }

  /**
   * 列出目录内容
   * @param path 目录路径
   */
  static async listDirectory(path: string): Promise<FileInfo[]> {
    try {
      return await invoke("list_directory", { path });
    } catch (error) {
      console.error("列出目录内容失败:", error);
      throw error;
    }
  }

  /**
   * 复制文件
   * @param source 源文件路径
   * @param destination 目标文件路径
   */
  static async copyFile(source: string, destination: string): Promise<void> {
    try {
      await invoke("copy_file", { source, destination });
    } catch (error) {
      console.error("复制文件失败:", error);
      throw error;
    }
  }

  /**
   * 移动文件
   * @param source 源文件路径
   * @param destination 目标文件路径
   */
  static async moveFile(source: string, destination: string): Promise<void> {
    try {
      await invoke("move_file", { source, destination });
    } catch (error) {
      console.error("移动文件失败:", error);
      throw error;
    }
  }

  /**
   * 重命名文件
   * @param path 文件路径
   * @param newName 新文件名
   */
  static async renameFile(path: string, newName: string): Promise<void> {
    try {
      await invoke("rename_file", { path, newName });
    } catch (error) {
      console.error("重命名文件失败:", error);
      throw error;
    }
  }

  /**
   * 搜索文件
   * @param directory 目录路径
   * @param pattern 搜索模式
   */
  static async searchFiles(directory: string, pattern: string): Promise<string[]> {
    try {
      return await invoke("search_files", { directory, pattern });
    } catch (error) {
      console.error("搜索文件失败:", error);
      throw error;
    }
  }

  /**
   * 字符串替换
   * @param path 文件路径
   * @param search 搜索字符串
   * @param replace 替换字符串
   */
  static async strReplace(path: string, search: string, replace: string): Promise<void> {
    try {
      await invoke("str_replace", { path, search, replace });
    } catch (error) {
      console.error("字符串替换失败:", error);
      throw error;
    }
  }

  /**
   * 在指定行插入内容
   * @param path 文件路径
   * @param line 行号
   * @param content 内容
   */
  static async insertAtLine(path: string, line: number, content: string): Promise<void> {
    try {
      await invoke("insert_at_line", { path, line, content });
    } catch (error) {
      console.error("在指定行插入内容失败:", error);
      throw error;
    }
  }

  /**
   * 撤销编辑
   * @param path 文件路径
   */
  static async undoEdit(path: string): Promise<void> {
    try {
      await invoke("undo_edit", { path });
    } catch (error) {
      console.error("撤销编辑失败:", error);
      throw error;
    }
  }
} 