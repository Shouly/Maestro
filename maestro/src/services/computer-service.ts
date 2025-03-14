import { invoke } from '@tauri-apps/api/core';
import { Coordinates, MouseButton, ScrollDirection, SystemInfo } from "./types";

/**
 * 计算机控制服务，用于调用ComputerTool的功能
 */
export class ComputerService {
  /**
   * 获取系统信息
   */
  static async getSystemInfo(): Promise<SystemInfo> {
    try {
      return await invoke("get_system_info");
    } catch (error) {
      console.error("获取系统信息失败:", error);
      throw error;
    }
  }

  /**
   * 截取屏幕
   * @returns 截图的Base64编码
   */
  static async takeScreenshot(): Promise<string> {
    try {
      return await invoke("take_screenshot");
    } catch (error) {
      console.error("截取屏幕失败:", error);
      throw error;
    }
  }

  /**
   * 获取鼠标位置
   */
  static async getMousePosition(): Promise<Coordinates> {
    try {
      return await invoke("get_mouse_position");
    } catch (error) {
      console.error("获取鼠标位置失败:", error);
      throw error;
    }
  }

  /**
   * 移动鼠标到指定位置
   * @param x X坐标
   * @param y Y坐标
   */
  static async moveMouse(x: number, y: number): Promise<void> {
    try {
      await invoke("move_mouse", { x, y });
    } catch (error) {
      console.error("移动鼠标失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标点击
   * @param button 鼠标按钮
   */
  static async mouseClick(button: MouseButton = "left"): Promise<void> {
    try {
      await invoke("mouse_click", { button });
    } catch (error) {
      console.error("鼠标点击失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标双击
   * @param button 鼠标按钮
   */
  static async mouseDoubleClick(button: MouseButton = "left"): Promise<void> {
    try {
      await invoke("mouse_double_click", { button });
    } catch (error) {
      console.error("鼠标双击失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标三击
   * @param button 鼠标按钮
   */
  static async mouseTripleClick(button: MouseButton = "left"): Promise<void> {
    try {
      await invoke("mouse_triple_click", { button });
    } catch (error) {
      console.error("鼠标三击失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标按下
   * @param button 鼠标按钮
   */
  static async mouseDown(button: MouseButton = "left"): Promise<void> {
    try {
      await invoke("mouse_down", { button });
    } catch (error) {
      console.error("鼠标按下失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标释放
   * @param button 鼠标按钮
   */
  static async mouseUp(button: MouseButton = "left"): Promise<void> {
    try {
      await invoke("mouse_up", { button });
    } catch (error) {
      console.error("鼠标释放失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标拖拽
   * @param fromX 起始X坐标
   * @param fromY 起始Y坐标
   * @param toX 目标X坐标
   * @param toY 目标Y坐标
   * @param button 鼠标按钮
   */
  static async mouseDrag(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    button: MouseButton = "left"
  ): Promise<void> {
    try {
      await invoke("mouse_drag", { fromX, fromY, toX, toY, button });
    } catch (error) {
      console.error("鼠标拖拽失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标滚动
   * @param direction 滚动方向
   * @param amount 滚动量
   */
  static async mouseScroll(
    direction: ScrollDirection,
    amount: number
  ): Promise<void> {
    try {
      await invoke("mouse_scroll_direction", { direction, amount });
    } catch (error) {
      console.error("鼠标滚动失败:", error);
      throw error;
    }
  }

  /**
   * 按键
   * @param key 按键
   */
  static async keyPress(key: string): Promise<void> {
    try {
      await invoke("key_press", { key });
    } catch (error) {
      console.error("按键失败:", error);
      throw error;
    }
  }

  /**
   * 按键序列
   * @param keys 按键序列
   */
  static async keySequence(keys: string[]): Promise<void> {
    try {
      await invoke("key_sequence", { keys });
    } catch (error) {
      console.error("按键序列失败:", error);
      throw error;
    }
  }

  /**
   * 组合键
   * @param keys 组合键
   */
  static async keyCombo(keys: string[]): Promise<void> {
    try {
      await invoke("key_combo", { keys });
    } catch (error) {
      console.error("组合键失败:", error);
      throw error;
    }
  }

  /**
   * 按键按下
   * @param key 按键
   */
  static async keyDown(key: string): Promise<void> {
    try {
      await invoke("key_down", { key });
    } catch (error) {
      console.error("按键按下失败:", error);
      throw error;
    }
  }

  /**
   * 按键释放
   * @param key 按键
   */
  static async keyUp(key: string): Promise<void> {
    try {
      await invoke("key_up", { key });
    } catch (error) {
      console.error("按键释放失败:", error);
      throw error;
    }
  }

  /**
   * 输入文本
   * @param text 文本
   */
  static async typeText(text: string): Promise<void> {
    try {
      await invoke("type_text", { text });
    } catch (error) {
      console.error("输入文本失败:", error);
      throw error;
    }
  }

  /**
   * 等待
   * @param milliseconds 毫秒
   */
  static async wait(milliseconds: number): Promise<void> {
    try {
      await invoke("wait", { milliseconds });
    } catch (error) {
      console.error("等待失败:", error);
      throw error;
    }
  }

  /**
   * 获取剪贴板内容
   */
  static async getClipboard(): Promise<string> {
    try {
      return await invoke("get_clipboard");
    } catch (error) {
      console.error("获取剪贴板内容失败:", error);
      throw error;
    }
  }

  /**
   * 设置剪贴板内容
   * @param text 文本
   */
  static async setClipboard(text: string): Promise<void> {
    try {
      await invoke("set_clipboard", { text });
    } catch (error) {
      console.error("设置剪贴板内容失败:", error);
      throw error;
    }
  }
} 