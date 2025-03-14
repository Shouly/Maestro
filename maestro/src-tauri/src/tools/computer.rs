use std::collections::HashMap;
use std::sync::Mutex;
use std::time::Duration;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use screenshots::Screen;
use base64::Engine;
use base64::engine::general_purpose::STANDARD;
use sysinfo::{System, SystemExt, ProcessExt, DiskExt, NetworkExt, ComponentExt, CpuExt, PidExt};
use enigo::{Enigo, MouseControllable, KeyboardControllable, Key, MouseButton};
use tokio::time::sleep;
use clipboard::{ClipboardContext, ClipboardProvider};

use super::error::{ToolResult, io_err, arg_err};

/// 系统信息
#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    /// 操作系统名称
    pub os_name: String,
    /// 操作系统版本
    pub os_version: String,
    /// 主机名
    pub hostname: String,
    /// 内核版本
    pub kernel_version: String,
    /// CPU信息
    pub cpu: CpuInfo,
    /// 内存信息
    pub memory: MemoryInfo,
    /// 磁盘信息
    pub disks: Vec<DiskInfo>,
    /// 网络信息
    pub networks: HashMap<String, NetworkInfo>,
}

/// CPU信息
#[derive(Debug, Serialize, Deserialize)]
pub struct CpuInfo {
    /// CPU名称
    pub name: String,
    /// CPU核心数
    pub cores: usize,
    /// CPU使用率
    pub usage: f32,
    /// CPU频率
    pub frequency: u64,
    /// CPU温度
    pub temperature: Option<f32>,
}

/// 内存信息
#[derive(Debug, Serialize, Deserialize)]
pub struct MemoryInfo {
    /// 总内存
    pub total: u64,
    /// 已使用内存
    pub used: u64,
    /// 可用内存
    pub available: u64,
    /// 内存使用率
    pub usage: f32,
}

/// 磁盘信息
#[derive(Debug, Serialize, Deserialize)]
pub struct DiskInfo {
    /// 磁盘名称
    pub name: String,
    /// 磁盘类型
    pub disk_type: String,
    /// 文件系统
    pub file_system: String,
    /// 挂载点
    pub mount_point: String,
    /// 总容量
    pub total: u64,
    /// 已使用容量
    pub used: u64,
    /// 可用容量
    pub available: u64,
    /// 使用率
    pub usage: f32,
}

/// 网络信息
#[derive(Debug, Serialize, Deserialize)]
pub struct NetworkInfo {
    /// 接收的字节数
    pub received: u64,
    /// 发送的字节数
    pub transmitted: u64,
    /// 接收的数据包数
    pub packets_received: u64,
    /// 发送的数据包数
    pub packets_transmitted: u64,
    /// 接收错误数
    pub errors_received: u64,
    /// 发送错误数
    pub errors_transmitted: u64,
}

/// 获取系统信息
#[tauri::command]
pub fn get_system_info() -> ToolResult<SystemInfo> {
    // 初始化系统信息
    let mut system = System::new_all();
    system.refresh_all();
    
    // 获取基本系统信息
    let os_name = system.name().unwrap_or_else(|| "Unknown".to_string());
    let os_version = system.os_version().unwrap_or_else(|| "Unknown".to_string());
    let hostname = system.host_name().unwrap_or_else(|| "Unknown".to_string());
    let kernel_version = system.kernel_version().unwrap_or_else(|| "Unknown".to_string());
    
    // 获取CPU信息
    let cpu_info = if let Some(processor) = system.cpus().first() {
        // 获取CPU核心数
        let cores = system.cpus().len();
        
        // 获取CPU使用率
        let usage = processor.cpu_usage();
        
        // 获取CPU频率
        let frequency = processor.frequency();
        
        // 获取CPU温度
        let temperature = system.components()
            .iter()
            .find(|component| component.label().contains("CPU"))
            .map(|component| component.temperature());
        
        CpuInfo {
            name: processor.name().to_string(),
            cores,
            usage,
            frequency,
            temperature,
        }
    } else {
        return io_err("无法获取CPU信息");
    };
    
    // 获取内存信息
    let total_memory = system.total_memory();
    let used_memory = system.used_memory();
    let available_memory = total_memory.saturating_sub(used_memory);
    let memory_usage = if total_memory > 0 {
        (used_memory as f32 / total_memory as f32) * 100.0
    } else {
        0.0
    };
    
    let memory_info = MemoryInfo {
        total: total_memory,
        used: used_memory,
        available: available_memory,
        usage: memory_usage,
    };
    
    // 获取磁盘信息
    let mut disks = Vec::new();
    for disk in system.disks() {
        let total = disk.total_space();
        let available = disk.available_space();
        let used = total.saturating_sub(available);
        let usage = if total > 0 {
            (used as f32 / total as f32) * 100.0
        } else {
            0.0
        };
        
        let disk_type = format!("{:?}", disk.kind());
        
        disks.push(DiskInfo {
            name: disk.name().to_string_lossy().to_string(),
            disk_type,
            file_system: String::from_utf8_lossy(disk.file_system()).to_string(),
            mount_point: disk.mount_point().to_string_lossy().to_string(),
            total,
            used,
            available,
            usage,
        });
    }
    
    // 获取网络信息
    let mut networks = HashMap::new();
    for (interface_name, network) in system.networks() {
        networks.insert(interface_name.clone(), NetworkInfo {
            received: network.received(),
            transmitted: network.transmitted(),
            packets_received: network.packets_received(),
            packets_transmitted: network.packets_transmitted(),
            errors_received: network.errors_on_received(),
            errors_transmitted: network.errors_on_transmitted(),
        });
    }
    
    Ok(SystemInfo {
        os_name,
        os_version,
        hostname,
        kernel_version,
        cpu: cpu_info,
        memory: memory_info,
        disks,
        networks,
    })
}

/// 进程信息
#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessInfo {
    /// 进程ID
    pub pid: u32,
    /// 进程名称
    pub name: String,
    /// 内存使用量（字节）
    pub memory: u64,
    /// CPU使用率
    pub cpu_usage: f32,
    /// 运行时间（秒）
    pub run_time: u64,
    /// 用户ID
    pub user_id: Option<String>,
    /// 状态
    pub status: String,
}

/// 获取进程列表
#[tauri::command]
pub fn get_processes() -> ToolResult<Vec<ProcessInfo>> {
    let mut system = System::new_all();
    system.refresh_all();
    
    let mut processes = Vec::new();
    for (pid, process) in system.processes() {
        processes.push(ProcessInfo {
            pid: pid.as_u32(),
            name: process.name().to_string(),
            memory: process.memory(),
            cpu_usage: process.cpu_usage(),
            run_time: process.run_time(),
            user_id: process.user_id().map(|id| id.to_string()),
            status: format!("{:?}", process.status()),
        });
    }
    
    Ok(processes)
}

/// 获取系统负载
#[derive(Debug, Serialize, Deserialize)]
pub struct SystemLoad {
    /// 1分钟负载
    pub one: f64,
    /// 5分钟负载
    pub five: f64,
    /// 15分钟负载
    pub fifteen: f64,
}

/// 获取系统负载
#[tauri::command]
pub fn get_system_load() -> ToolResult<SystemLoad> {
    let mut system = System::new_all();
    system.refresh_all();
    
    let load_avg = system.load_average();
    
    Ok(SystemLoad {
        one: load_avg.one,
        five: load_avg.five,
        fifteen: load_avg.fifteen,
    })
}

/// 获取系统启动时间
#[tauri::command]
pub fn get_boot_time() -> ToolResult<u64> {
    let mut system = System::new_all();
    system.refresh_all();
    
    Ok(system.boot_time())
}

/// 屏幕截图结果
#[derive(Debug, Serialize, Deserialize)]
pub struct ScreenshotResult {
    /// Base64编码的图像数据
    pub base64_image: String,
    /// 图像宽度
    pub width: u32,
    /// 图像高度
    pub height: u32,
    /// 图像MIME类型
    pub mime_type: String,
}

/// 鼠标按钮类型
#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum MouseButtonType {
    /// 左键
    Left,
    /// 右键
    Right,
    /// 中键
    Middle,
}

/// 将 MouseButtonType 转换为 enigo 的 MouseButton
fn convert_mouse_button(button: MouseButtonType) -> MouseButton {
    match button {
        MouseButtonType::Left => MouseButton::Left,
        MouseButtonType::Right => MouseButton::Right,
        MouseButtonType::Middle => MouseButton::Middle,
    }
}

/// 鼠标位置
#[derive(Debug, Serialize, Deserialize)]
pub struct MousePosition {
    /// X坐标
    pub x: i32,
    /// Y坐标
    pub y: i32,
}

/// 屏幕截图
#[tauri::command]
pub async fn take_screenshot() -> ToolResult<ScreenshotResult> {
    // 获取所有屏幕
    let screens = match Screen::all() {
        Ok(screens) => screens,
        Err(err) => return io_err(format!("无法获取屏幕信息: {}", err)),
    };
    
    if screens.is_empty() {
        return io_err("未找到可用屏幕");
    }
    
    // 使用主屏幕
    let screen = &screens[0];
    
    // 捕获屏幕截图
    let image = match screen.capture() {
        Ok(image) => image,
        Err(err) => return io_err(format!("无法捕获屏幕截图: {}", err)),
    };
    
    // 获取图像尺寸
    let width = image.width();
    let height = image.height();
    
    // 将图像转换为Base64
    let mut buffer = Vec::new();
    let dynamic_image = image::DynamicImage::ImageRgba8(image);
    if let Err(err) = dynamic_image.write_to(&mut std::io::Cursor::new(&mut buffer), image::ImageOutputFormat::Png) {
        return io_err(format!("无法将图像转换为PNG格式: {}", err));
    }
    let base64_image = STANDARD.encode(&buffer);
    
    Ok(ScreenshotResult {
        base64_image,
        width,
        height,
        mime_type: "image/png".to_string(),
    })
}

/// 获取鼠标位置
#[tauri::command]
pub fn get_mouse_position() -> ToolResult<MousePosition> {
    let enigo = Enigo::new();
    let (x, y) = enigo.mouse_location();
    
    Ok(MousePosition { x, y })
}

/// 移动鼠标
#[tauri::command]
pub fn move_mouse(x: i32, y: i32) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.mouse_move_to(x, y);
    
    Ok(())
}

/// 鼠标点击
#[tauri::command]
pub fn mouse_click(button: MouseButtonType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.mouse_click(convert_mouse_button(button));
    
    Ok(())
}

/// 鼠标双击
#[tauri::command]
pub fn mouse_double_click(button: MouseButtonType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.mouse_click(convert_mouse_button(button));
    enigo.mouse_click(convert_mouse_button(button));
    
    Ok(())
}

/// 鼠标按下
#[tauri::command]
pub fn mouse_down(button: MouseButtonType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.mouse_down(convert_mouse_button(button));
    
    Ok(())
}

/// 鼠标释放
#[tauri::command]
pub fn mouse_up(button: MouseButtonType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.mouse_up(convert_mouse_button(button));
    
    Ok(())
}

/// 鼠标拖拽
#[tauri::command]
pub fn mouse_drag(from_x: i32, from_y: i32, to_x: i32, to_y: i32, button: MouseButtonType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    
    // 移动到起始位置
    enigo.mouse_move_to(from_x, from_y);
    
    // 按下鼠标按钮
    enigo.mouse_down(convert_mouse_button(button));
    
    // 移动到目标位置
    enigo.mouse_move_to(to_x, to_y);
    
    // 释放鼠标按钮
    enigo.mouse_up(convert_mouse_button(button));
    
    Ok(())
}

/// 鼠标滚动
#[tauri::command]
pub fn mouse_scroll(x: i32, y: i32) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    
    if x != 0 {
        enigo.mouse_scroll_x(x);
    }
    
    if y != 0 {
        enigo.mouse_scroll_y(y);
    }
    
    Ok(())
}

/// 键盘按键
#[derive(Debug, Serialize, Deserialize)]
pub enum KeyType {
    /// 普通字符
    Layout(char),
    /// 特殊按键
    Raw(String),
}

impl KeyType {
    fn to_enigo_key(&self) -> Key {
        match self {
            KeyType::Layout(c) => Key::Layout(*c),
            KeyType::Raw(s) => match s.as_str() {
                "Return" => Key::Return,
                "Tab" => Key::Tab,
                "Space" => Key::Space,
                "Backspace" => Key::Backspace,
                "Escape" => Key::Escape,
                "Super" => Key::Meta,
                "Command" => Key::Meta,
                "Windows" => Key::Meta,
                "Shift" => Key::Shift,
                "CapsLock" => Key::CapsLock,
                "Alt" => Key::Alt,
                "Option" => Key::Alt,
                "Control" => Key::Control,
                "Home" => Key::Home,
                "End" => Key::End,
                "PageUp" => Key::PageUp,
                "PageDown" => Key::PageDown,
                "LeftArrow" => Key::LeftArrow,
                "RightArrow" => Key::RightArrow,
                "UpArrow" => Key::UpArrow,
                "DownArrow" => Key::DownArrow,
                "Delete" => Key::Delete,
                "F1" => Key::F1,
                "F2" => Key::F2,
                "F3" => Key::F3,
                "F4" => Key::F4,
                "F5" => Key::F5,
                "F6" => Key::F6,
                "F7" => Key::F7,
                "F8" => Key::F8,
                "F9" => Key::F9,
                "F10" => Key::F10,
                "F11" => Key::F11,
                "F12" => Key::F12,
                _ => Key::Layout(' '), // 默认为空格
            },
        }
    }
}

/// 按下键盘按键
#[tauri::command]
pub fn key_press(key: KeyType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.key_click(key.to_enigo_key());
    
    Ok(())
}

/// 按下组合键
#[tauri::command]
pub fn key_sequence(keys: Vec<KeyType>) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    
    for key in keys {
        enigo.key_click(key.to_enigo_key());
    }
    
    Ok(())
}

/// 按住键盘按键
#[tauri::command]
pub fn key_down(key: KeyType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.key_down(key.to_enigo_key());
    
    Ok(())
}

/// 释放键盘按键
#[tauri::command]
pub fn key_up(key: KeyType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.key_up(key.to_enigo_key());
    
    Ok(())
}

/// 输入文本
#[tauri::command]
pub fn type_text(text: String) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.key_sequence(&text);
    
    Ok(())
}

/// 等待指定时间
#[tauri::command]
pub async fn wait(milliseconds: u64) -> ToolResult<()> {
    sleep(Duration::from_millis(milliseconds)).await;
    
    Ok(())
}

/// 组合键
#[tauri::command]
pub fn key_combo(keys: Vec<KeyType>) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    
    // 按下所有按键
    for key in &keys {
        enigo.key_down(key.to_enigo_key());
    }
    
    // 释放所有按键（按相反顺序）
    for key in keys.iter().rev() {
        enigo.key_up(key.to_enigo_key());
    }
    
    Ok(())
}

/// 滚动方向
#[derive(Debug, Serialize, Deserialize)]
pub enum ScrollDirection {
    /// 向上滚动
    Up,
    /// 向下滚动
    Down,
    /// 向左滚动
    Left,
    /// 向右滚动
    Right,
}

/// 三击鼠标
#[tauri::command]
pub fn mouse_triple_click(button: MouseButtonType) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    enigo.mouse_click(convert_mouse_button(button));
    enigo.mouse_click(convert_mouse_button(button));
    enigo.mouse_click(convert_mouse_button(button));
    
    Ok(())
}

/// 高级滚动 - 支持指定方向和数量
#[tauri::command]
pub fn mouse_scroll_direction(direction: ScrollDirection, amount: i32) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    
    match direction {
        ScrollDirection::Up => enigo.mouse_scroll_y(amount),
        ScrollDirection::Down => enigo.mouse_scroll_y(-amount),
        ScrollDirection::Left => enigo.mouse_scroll_x(-amount),
        ScrollDirection::Right => enigo.mouse_scroll_x(amount),
    }
    
    Ok(())
}

/// 等待指定时间后执行操作
#[tauri::command]
pub async fn wait_and_action(
    milliseconds: u64, 
    action: Option<String>,
    x: Option<i32>,
    y: Option<i32>
) -> ToolResult<()> {
    // 等待指定时间
    sleep(Duration::from_millis(milliseconds)).await;
    
    // 如果指定了操作，执行操作
    if let Some(action) = action {
        match action.as_str() {
            "click" => {
                if let (Some(x), Some(y)) = (x, y) {
                    let mut enigo = Enigo::new();
                    enigo.mouse_move_to(x, y);
                    enigo.mouse_click(MouseButton::Left);
                } else {
                    return arg_err("点击操作需要指定x和y坐标");
                }
            },
            "move" => {
                if let (Some(x), Some(y)) = (x, y) {
                    let mut enigo = Enigo::new();
                    enigo.mouse_move_to(x, y);
                } else {
                    return arg_err("移动操作需要指定x和y坐标");
                }
            },
            _ => return arg_err(format!("不支持的操作: {}", action)),
        }
    }
    
    Ok(())
}

/// 获取剪贴板内容
#[tauri::command]
pub fn get_clipboard() -> ToolResult<String> {
    let mut ctx: ClipboardContext = match ClipboardProvider::new() {
        Ok(ctx) => ctx,
        Err(err) => return io_err(format!("无法创建剪贴板上下文: {}", err)),
    };
    
    match ctx.get_contents() {
        Ok(contents) => Ok(contents),
        Err(err) => io_err(format!("无法获取剪贴板内容: {}", err)),
    }
}

/// 设置剪贴板内容
#[tauri::command]
pub fn set_clipboard(content: String) -> ToolResult<()> {
    let mut ctx: ClipboardContext = match ClipboardProvider::new() {
        Ok(ctx) => ctx,
        Err(err) => return io_err(format!("无法创建剪贴板上下文: {}", err)),
    };
    
    match ctx.set_contents(content) {
        Ok(_) => Ok(()),
        Err(err) => io_err(format!("无法设置剪贴板内容: {}", err)),
    }
}

/// 坐标缩放配置
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScalingConfig {
    /// 是否启用缩放
    pub enabled: bool,
    /// 目标宽度
    pub target_width: u32,
    /// 目标高度
    pub target_height: u32,
    /// 源宽度
    pub source_width: u32,
    /// 源高度
    pub source_height: u32,
}

static SCALING_CONFIG: Lazy<Mutex<Option<ScalingConfig>>> = Lazy::new(|| {
    Mutex::new(None)
});

/// 设置坐标缩放配置
#[tauri::command]
pub fn set_scaling_config(config: ScalingConfig) -> ToolResult<()> {
    let mut scaling_config = SCALING_CONFIG.lock().unwrap();
    *scaling_config = Some(config);
    Ok(())
}

/// 获取坐标缩放配置
#[tauri::command]
pub fn get_scaling_config() -> ToolResult<Option<ScalingConfig>> {
    let scaling_config = SCALING_CONFIG.lock().unwrap();
    Ok(scaling_config.clone())
}

/// 缩放坐标
#[tauri::command]
pub fn scale_coordinates(x: i32, y: i32, scale_up: bool) -> ToolResult<(i32, i32)> {
    let scaling_config = SCALING_CONFIG.lock().unwrap();
    
    if let Some(config) = &*scaling_config {
        if !config.enabled {
            return Ok((x, y));
        }
        
        let x_scaling_factor = config.target_width as f64 / config.source_width as f64;
        let y_scaling_factor = config.target_height as f64 / config.source_height as f64;
        
        if scale_up {
            // 放大坐标
            Ok((
                (x as f64 / x_scaling_factor).round() as i32,
                (y as f64 / y_scaling_factor).round() as i32,
            ))
        } else {
            // 缩小坐标
            Ok((
                (x as f64 * x_scaling_factor).round() as i32,
                (y as f64 * y_scaling_factor).round() as i32,
            ))
        }
    } else {
        Ok((x, y))
    }
}

/// 点击指定坐标
#[tauri::command]
pub async fn _click_at(x: i32, y: i32, button: Option<MouseButtonType>, double: Option<bool>) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    
    // 移动到指定位置
    enigo.mouse_move_to(x, y);
    
    // 等待一小段时间确保鼠标已经移动到位
    sleep(Duration::from_millis(50)).await;
    
    // 执行点击
    if double.unwrap_or(false) {
        enigo.mouse_click(convert_mouse_button(button.unwrap_or(MouseButtonType::Left)));
        enigo.mouse_click(convert_mouse_button(button.unwrap_or(MouseButtonType::Left)));
    } else {
        enigo.mouse_click(convert_mouse_button(button.unwrap_or(MouseButtonType::Left)));
    }
    
    Ok(())
}

/// 选择文本（通过三击）
#[tauri::command]
pub async fn _select_text(x: i32, y: i32) -> ToolResult<()> {
    let mut enigo = Enigo::new();
    
    // 移动到指定位置
    enigo.mouse_move_to(x, y);
    
    // 等待一小段时间确保鼠标已经移动到位
    sleep(Duration::from_millis(50)).await;
    
    // 执行三击选择文本
    enigo.mouse_click(MouseButton::Left);
    sleep(Duration::from_millis(50)).await;
    enigo.mouse_click(MouseButton::Left);
    sleep(Duration::from_millis(50)).await;
    enigo.mouse_click(MouseButton::Left);
    
    Ok(())
} 