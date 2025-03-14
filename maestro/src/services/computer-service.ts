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
      // 调用Rust函数并获取ScreenshotResult对象
      const result = await invoke<{ base64_image: string }>("take_screenshot");
      
      // 从结果中提取base64_image字段
      if (result && typeof result === 'object' && 'base64_image' in result) {
        return result.base64_image;
      } else {
        console.error("截图结果格式不正确:", result);
        throw new Error("截图结果格式不正确");
      }
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
   * 获取光标位置（鼠标位置的别名）
   */
  static async getCursorPosition(): Promise<Coordinates> {
    return this.getMousePosition();
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
   * 在指定位置点击
   * @param button 鼠标按钮
   * @param x X坐标（可选）
   * @param y Y坐标（可选）
   */
  static async click(button: MouseButton = "left", x?: number, y?: number): Promise<void> {
    try {
      if (x !== undefined && y !== undefined) {
        await this.moveMouse(x, y);
      }
      await this.mouseClick(button);
    } catch (error) {
      console.error("点击失败:", error);
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
   * 在指定位置双击
   * @param x X坐标
   * @param y Y坐标
   */
  static async doubleClick(x?: number, y?: number): Promise<void> {
    try {
      if (x !== undefined && y !== undefined) {
        await this.moveMouse(x, y);
      }
      await this.mouseDoubleClick("left");
    } catch (error) {
      console.error("双击失败:", error);
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
   * 在指定位置三击
   * @param x X坐标
   * @param y Y坐标
   */
  static async tripleClick(x?: number, y?: number): Promise<void> {
    try {
      if (x !== undefined && y !== undefined) {
        await this.moveMouse(x, y);
      }
      await this.mouseTripleClick("left");
    } catch (error) {
      console.error("三击失败:", error);
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
   * 在指定位置按下鼠标
   * @param x X坐标
   * @param y Y坐标
   */
  static async mouseDownAt(x: number, y: number): Promise<void> {
    try {
      await this.moveMouse(x, y);
      await invoke("mouse_down", { button: "left" });
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
   * 在指定位置释放鼠标
   * @param x X坐标
   * @param y Y坐标
   */
  static async mouseUpAt(x: number, y: number): Promise<void> {
    try {
      await this.moveMouse(x, y);
      await invoke("mouse_up", { button: "left" });
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
   * 鼠标拖拽（别名）
   */
  static async dragMouse(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): Promise<void> {
    return this.mouseDrag(fromX, fromY, toX, toY, "left");
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
      await invoke("mouse_scroll", { direction, amount });
    } catch (error) {
      console.error("鼠标滚动失败:", error);
      throw error;
    }
  }

  /**
   * 鼠标滚动（别名）
   */
  static async scroll(
    direction: ScrollDirection,
    amount: number
  ): Promise<void> {
    return this.mouseScroll(direction, amount);
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
   * 按键（别名）
   */
  static async pressKey(key: string): Promise<void> {
    return this.keyPress(key);
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
   * 按下按键
   * @param key 按键
   */
  static async keyDown(key: string): Promise<void> {
    try {
      await invoke("key_down", { key });
    } catch (error) {
      console.error("按下按键失败:", error);
      throw error;
    }
  }

  /**
   * 释放按键
   * @param key 按键
   */
  static async keyUp(key: string): Promise<void> {
    try {
      await invoke("key_up", { key });
    } catch (error) {
      console.error("释放按键失败:", error);
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
      await new Promise(resolve => setTimeout(resolve, milliseconds));
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