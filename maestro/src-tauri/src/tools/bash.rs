use std::collections::HashMap;
use std::process::{Command, Stdio, Child};
use std::io::{BufRead, BufReader, Read};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};
use tokio::process::Command as AsyncCommand;
use tokio::io::{AsyncBufReadExt, BufReader as AsyncBufReader};
use tokio::time::timeout;
use std::time::Duration;
use chrono::{DateTime, Utc};
use once_cell::sync::Lazy;

use super::error::{ToolResult, cmd_err};

/// 命令执行结果
#[derive(Debug, Serialize, Deserialize)]
pub struct CommandOutput {
    /// 命令退出码
    pub exit_code: i32,
    /// 标准输出
    pub stdout: String,
    /// 标准错误
    pub stderr: String,
    /// 命令是否成功执行
    pub success: bool,
}

/// 命令执行选项
#[derive(Debug, Deserialize)]
pub struct CommandOptions {
    /// 工作目录
    pub cwd: Option<String>,
    /// 环境变量
    pub env: Option<HashMap<String, String>>,
    /// 是否合并标准错误到标准输出
    pub merge_stderr: Option<bool>,
    /// 是否以管理员权限运行（需要用户确认）
    pub admin: Option<bool>,
    /// 超时时间（秒）
    pub timeout: Option<u64>,
}

impl Default for CommandOptions {
    fn default() -> Self {
        Self {
            cwd: None,
            env: None,
            merge_stderr: Some(false),
            admin: Some(false),
            timeout: None,
        }
    }
}

/// 后台进程信息
#[derive(Debug, Serialize, Deserialize)]
pub struct BackgroundProcess {
    /// 进程ID
    pub id: u32,
    /// 命令
    pub command: String,
    /// 启动时间
    pub start_time: u64,
    /// 状态
    pub status: String,
}

// 全局后台进程存储
lazy_static::lazy_static! {
    static ref BACKGROUND_PROCESSES: Arc<Mutex<HashMap<u32, Child>>> = Arc::new(Mutex::new(HashMap::new()));
}

// 全局命令历史记录
static COMMAND_HISTORY: Lazy<Mutex<Vec<CommandHistoryEntry>>> = Lazy::new(|| {
    Mutex::new(Vec::with_capacity(100))
});

/// 命令历史记录条目
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandHistoryEntry {
    /// 命令ID
    pub id: usize,
    /// 命令
    pub command: String,
    /// 参数
    pub args: Vec<String>,
    /// 工作目录
    pub cwd: Option<String>,
    /// 执行时间
    pub timestamp: DateTime<Utc>,
    /// 执行结果
    pub success: bool,
    /// 退出码
    pub exit_code: i32,
}

/// 添加命令到历史记录
fn add_to_history(command: &str, args: &[String], cwd: Option<String>, exit_code: i32, success: bool) {
    if let Ok(mut history) = COMMAND_HISTORY.lock() {
        let entry = CommandHistoryEntry {
            id: history.len(),
            command: command.to_string(),
            args: args.to_vec(),
            cwd,
            timestamp: Utc::now(),
            success,
            exit_code,
        };
        
        history.push(entry);
        
        // 限制历史记录长度，避免内存泄漏
        if history.len() > 100 {
            history.remove(0);
        }
    }
}

/// 获取命令历史记录
#[tauri::command]
pub fn get_command_history(limit: Option<usize>) -> ToolResult<Vec<CommandHistoryEntry>> {
    let history = COMMAND_HISTORY.lock().unwrap();
    let limit = limit.unwrap_or(20).min(100);
    
    if history.len() <= limit {
        Ok(history.clone())
    } else {
        Ok(history[history.len() - limit..].to_vec())
    }
}

/// 搜索命令历史记录
#[tauri::command]
pub fn search_command_history(query: String) -> ToolResult<Vec<CommandHistoryEntry>> {
    let history = COMMAND_HISTORY.lock().unwrap();
    let query = query.to_lowercase();
    
    let results: Vec<CommandHistoryEntry> = history
        .iter()
        .filter(|entry| {
            entry.command.to_lowercase().contains(&query) || 
            entry.args.iter().any(|arg| arg.to_lowercase().contains(&query))
        })
        .cloned()
        .collect();
    
    Ok(results)
}

/// 重新执行历史命令
#[tauri::command]
pub fn rerun_command(id: usize) -> ToolResult<CommandOutput> {
    let history = COMMAND_HISTORY.lock().unwrap();
    
    if let Some(entry) = history.iter().find(|e| e.id == id) {
        let command = entry.command.clone();
        let args = entry.args.clone();
        let options = CommandOptions {
            cwd: entry.cwd.clone(),
            ..Default::default()
        };
        
        drop(history); // 释放锁
        
        execute_command(command, args, Some(options))
    } else {
        cmd_err(format!("未找到ID为 {} 的命令", id))
    }
}

/// 执行系统命令
#[tauri::command]
pub fn execute_command(command: String, args: Vec<String>, options: Option<CommandOptions>) -> ToolResult<CommandOutput> {
    let options = options.unwrap_or_default();
    
    // 创建命令
    let mut cmd = Command::new(&command);
    
    // 添加参数
    cmd.args(&args);
    
    // 设置工作目录
    if let Some(cwd) = &options.cwd {
        cmd.current_dir(PathBuf::from(cwd));
    }
    
    // 设置环境变量
    if let Some(env_vars) = &options.env {
        for (key, value) in env_vars {
            cmd.env(key, value);
        }
    }
    
    // 设置标准输出和标准错误
    let merge_stderr = options.merge_stderr.unwrap_or(false);
    if merge_stderr {
        cmd.stderr(Stdio::piped()).stdout(Stdio::piped());
    } else {
        cmd.stderr(Stdio::piped()).stdout(Stdio::piped());
    }
    
    // 执行命令
    let mut child = match cmd.spawn() {
        Ok(child) => child,
        Err(err) => return cmd_err(format!("无法执行命令: {}", err)),
    };
    
    // 读取标准输出
    let stdout = match child.stdout.take() {
        Some(stdout) => {
            let reader = BufReader::new(stdout);
            let lines: Vec<String> = reader.lines().filter_map(Result::ok).collect();
            lines.join("\n")
        },
        None => String::new(),
    };
    
    // 读取标准错误
    let stderr = match child.stderr.take() {
        Some(stderr) => {
            let reader = BufReader::new(stderr);
            let lines: Vec<String> = reader.lines().filter_map(Result::ok).collect();
            lines.join("\n")
        },
        None => String::new(),
    };
    
    // 等待命令执行完成
    let status = match child.wait() {
        Ok(status) => status,
        Err(err) => return cmd_err(format!("等待命令完成时出错: {}", err)),
    };
    
    // 获取退出码
    let exit_code = status.code().unwrap_or(-1);
    
    // 添加到历史记录
    add_to_history(&command, &args, options.cwd, exit_code, status.success());
    
    Ok(CommandOutput {
        exit_code,
        stdout,
        stderr,
        success: status.success(),
    })
}

/// 异步执行系统命令
#[tauri::command]
pub async fn execute_command_async(command: String, args: Vec<String>, options: Option<CommandOptions>) -> ToolResult<CommandOutput> {
    let options = options.unwrap_or_default();
    
    // 创建命令
    let mut cmd = AsyncCommand::new(&command);
    
    // 添加参数
    cmd.args(&args);
    
    // 设置工作目录
    if let Some(cwd) = options.cwd {
        cmd.current_dir(PathBuf::from(cwd));
    }
    
    // 设置环境变量
    if let Some(env_vars) = options.env {
        for (key, value) in env_vars {
            cmd.env(key, value);
        }
    }
    
    // 设置标准输出和标准错误
    let merge_stderr = options.merge_stderr.unwrap_or(false);
    if merge_stderr {
        cmd.stderr(Stdio::piped()).stdout(Stdio::piped());
    } else {
        cmd.stderr(Stdio::piped()).stdout(Stdio::piped());
    }
    
    // 设置超时
    let timeout_duration = options.timeout.map(|t| Duration::from_secs(t));
    
    // 执行命令
    let mut child = match cmd.spawn() {
        Ok(child) => child,
        Err(err) => return cmd_err(format!("无法执行命令: {}", err)),
    };
    
    // 读取标准输出
    let stdout = match child.stdout.take() {
        Some(stdout) => {
            let mut reader = AsyncBufReader::new(stdout).lines();
            let mut lines = Vec::new();
            
            while let Some(line) = reader.next_line().await.unwrap_or(None) {
                lines.push(line);
            }
            
            lines.join("\n")
        },
        None => String::new(),
    };
    
    // 读取标准错误
    let stderr = match child.stderr.take() {
        Some(stderr) => {
            let mut reader = AsyncBufReader::new(stderr).lines();
            let mut lines = Vec::new();
            
            while let Some(line) = reader.next_line().await.unwrap_or(None) {
                lines.push(line);
            }
            
            lines.join("\n")
        },
        None => String::new(),
    };
    
    // 等待命令执行完成，可能有超时
    let status = if let Some(duration) = timeout_duration {
        match timeout(duration, child.wait()).await {
            Ok(result) => match result {
                Ok(status) => status,
                Err(err) => return cmd_err(format!("等待命令完成时出错: {}", err)),
            },
            Err(_) => return cmd_err(format!("命令执行超时: {}秒", duration.as_secs())),
        }
    } else {
        match child.wait().await {
            Ok(status) => status,
            Err(err) => return cmd_err(format!("等待命令完成时出错: {}", err)),
        }
    };
    
    // 获取退出码
    let exit_code = status.code().unwrap_or(-1);
    
    Ok(CommandOutput {
        exit_code,
        stdout,
        stderr,
        success: status.success(),
    })
}

/// 在后台执行命令
#[tauri::command]
pub fn execute_command_background(command: String, args: Vec<String>, options: Option<CommandOptions>) -> ToolResult<u32> {
    let options = options.unwrap_or_default();
    
    // 创建命令
    let mut cmd = Command::new(&command);
    
    // 添加参数
    cmd.args(&args);
    
    // 设置工作目录
    if let Some(cwd) = options.cwd {
        cmd.current_dir(PathBuf::from(cwd));
    }
    
    // 设置环境变量
    if let Some(env_vars) = options.env {
        for (key, value) in env_vars {
            cmd.env(key, value);
        }
    }
    
    // 设置标准输出和标准错误（重定向到/dev/null或NUL）
    cmd.stdout(Stdio::null()).stderr(Stdio::null());
    
    // 执行命令
    let child = match cmd.spawn() {
        Ok(child) => child,
        Err(err) => return cmd_err(format!("无法执行命令: {}", err)),
    };
    
    // 获取进程ID
    let pid = child.id();
    
    // 存储进程
    BACKGROUND_PROCESSES.lock().unwrap().insert(pid, child);
    
    Ok(pid)
}

/// 获取后台进程列表
#[tauri::command]
pub fn list_background_processes() -> ToolResult<Vec<BackgroundProcess>> {
    let mut processes = BACKGROUND_PROCESSES.lock().unwrap();
    let mut result = Vec::new();
    
    for (&pid, child) in processes.iter_mut() {
        // 检查进程状态
        let status = match child.try_wait() {
            Ok(Some(status)) => format!("已退出: {}", status),
            Ok(None) => "运行中".to_string(),
            Err(err) => format!("错误: {}", err),
        };
        
        result.push(BackgroundProcess {
            id: pid,
            command: format!("进程 {}", pid), // 无法获取原始命令
            start_time: 0, // 无法获取启动时间
            status,
        });
    }
    
    Ok(result)
}

/// 终止后台进程
#[tauri::command]
pub fn terminate_background_process(pid: u32) -> ToolResult<bool> {
    let mut processes = BACKGROUND_PROCESSES.lock().unwrap();
    
    if let Some(mut child) = processes.remove(&pid) {
        match child.kill() {
            Ok(_) => Ok(true),
            Err(err) => {
                // 如果进程已经退出，也算成功
                if err.kind() == std::io::ErrorKind::InvalidInput {
                    Ok(true)
                } else {
                    cmd_err(format!("无法终止进程 {}: {}", pid, err))
                }
            }
        }
    } else {
        Ok(false) // 进程不存在
    }
}

/// 获取当前环境变量
#[tauri::command]
pub fn get_environment_variables() -> ToolResult<HashMap<String, String>> {
    let mut env_vars = HashMap::new();
    
    for (key, value) in std::env::vars() {
        env_vars.insert(key, value);
    }
    
    Ok(env_vars)
}

/// 获取当前工作目录
#[tauri::command]
pub fn get_current_directory() -> ToolResult<String> {
    match std::env::current_dir() {
        Ok(path) => Ok(path.to_string_lossy().to_string()),
        Err(err) => cmd_err(format!("无法获取当前工作目录: {}", err)),
    }
}

/// 检查命令是否存在
#[tauri::command]
pub fn check_command_exists(command: String) -> bool {
    which::which(&command).is_ok()
}

/// 监控进程
#[tauri::command]
pub fn monitor_process(pid: u32) -> ToolResult<CommandOutput> {
    // 使用ps命令获取进程信息
    let mut cmd = Command::new("ps");
    cmd.arg("-p").arg(pid.to_string()).arg("-o").arg("pid,ppid,user,%cpu,%mem,vsz,rss,tty,stat,start,time,command");
    
    // 执行命令
    let output = match cmd.output() {
        Ok(output) => output,
        Err(err) => return cmd_err(format!("无法监控进程: {}", err)),
    };
    
    // 解析输出
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    
    Ok(CommandOutput {
        exit_code: output.status.code().unwrap_or(-1),
        stdout,
        stderr,
        success: output.status.success(),
    })
}

/// Bash会话
pub struct BashSession {
    /// 进程
    process: Option<Child>,
    /// 是否已启动
    started: bool,
    /// 是否超时
    timed_out: bool,
    /// 超时时间（秒）
    timeout: f64,
    /// 输出延迟（秒）
    output_delay: f64,
    /// 退出标记
    sentinel: String,
}

impl BashSession {
    /// 创建新会话
    pub fn new() -> Self {
        Self {
            process: None,
            started: false,
            timed_out: false,
            timeout: 120.0,
            output_delay: 0.2,
            sentinel: "<<exit>>".to_string(),
        }
    }
    
    /// 启动会话
    pub fn start(&mut self) -> ToolResult<()> {
        if self.started {
            return Ok(());
        }
        
        let process = Command::new("/bin/bash")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn();
            
        match process {
            Ok(child) => {
                self.process = Some(child);
                self.started = true;
                Ok(())
            },
            Err(err) => cmd_err(format!("无法启动Bash会话: {}", err)),
        }
    }
    
    /// 停止会话
    pub fn stop(&mut self) -> ToolResult<()> {
        if !self.started {
            return cmd_err("会话尚未启动".to_string());
        }
        
        if let Some(mut process) = self.process.take() {
            let _ = process.kill();
            self.started = false;
        }
        
        Ok(())
    }
    
    /// 在会话中执行命令
    pub fn run(&mut self, command: &str) -> ToolResult<CommandOutput> {
        if !self.started {
            return cmd_err("会话尚未启动".to_string());
        }
        
        if self.timed_out {
            return cmd_err(format!("会话已超时，需要重新启动"));
        }
        
        let process = match &mut self.process {
            Some(process) => process,
            None => return cmd_err("会话进程不存在".to_string()),
        };
        
        // 获取标准输入
        let stdin = match process.stdin.as_mut() {
            Some(stdin) => stdin,
            None => return cmd_err("无法获取标准输入".to_string()),
        };
        
        // 发送命令
        let full_command = format!("{}; echo '{}'\n", command, self.sentinel);
        if let Err(err) = std::io::Write::write_all(stdin, full_command.as_bytes()) {
            return cmd_err(format!("无法发送命令: {}", err));
        }
        if let Err(err) = std::io::Write::flush(stdin) {
            return cmd_err(format!("无法刷新标准输入: {}", err));
        }
        
        // 读取输出
        let stdout = match process.stdout.as_mut() {
            Some(stdout) => stdout,
            None => return cmd_err("无法获取标准输出".to_string()),
        };
        
        let stderr = match process.stderr.as_mut() {
            Some(stderr) => stderr,
            None => return cmd_err("无法获取标准错误".to_string()),
        };
        
        // 读取输出直到找到退出标记
        let mut output = String::new();
        let mut buffer = [0; 1024];
        let start_time = std::time::Instant::now();
        
        loop {
            // 检查超时
            if start_time.elapsed().as_secs_f64() > self.timeout {
                self.timed_out = true;
                return cmd_err(format!("命令执行超时: {}秒", self.timeout));
            }
            
            // 读取输出
            match stdout.read(&mut buffer) {
                Ok(0) => break, // EOF
                Ok(n) => {
                    output.push_str(&String::from_utf8_lossy(&buffer[0..n]));
                    if output.contains(&self.sentinel) {
                        // 找到退出标记，截取到标记之前的内容
                        if let Some(pos) = output.find(&self.sentinel) {
                            output.truncate(pos);
                        }
                        break;
                    }
                },
                Err(err) => return cmd_err(format!("读取输出时出错: {}", err)),
            }
            
            // 短暂延迟
            std::thread::sleep(std::time::Duration::from_secs_f64(self.output_delay));
        }
        
        // 读取错误输出
        let mut error = String::new();
        match stderr.read_to_string(&mut error) {
            Ok(_) => {},
            Err(err) => return cmd_err(format!("读取错误输出时出错: {}", err)),
        }
        
        // 去除尾部换行符
        if output.ends_with('\n') {
            output.pop();
        }
        if error.ends_with('\n') {
            error.pop();
        }
        
        Ok(CommandOutput {
            exit_code: 0, // 无法获取真实退出码
            stdout: output,
            stderr: error,
            success: true, // 无法获取真实成功状态
        })
    }
}

// 全局Bash会话
static BASH_SESSION: Lazy<Mutex<BashSession>> = Lazy::new(|| {
    Mutex::new(BashSession::new())
});

/// 启动Bash会话
#[tauri::command]
pub fn start_bash_session() -> ToolResult<()> {
    let mut session = BASH_SESSION.lock().unwrap();
    session.start()
}

/// 停止Bash会话
#[tauri::command]
pub fn stop_bash_session() -> ToolResult<()> {
    let mut session = BASH_SESSION.lock().unwrap();
    session.stop()
}

/// 重启Bash会话
#[tauri::command]
pub fn restart_bash_session() -> ToolResult<()> {
    let mut session = BASH_SESSION.lock().unwrap();
    let _ = session.stop();
    session.start()
}

/// 在Bash会话中执行命令
#[tauri::command]
pub fn execute_in_session(command: String) -> ToolResult<CommandOutput> {
    let mut session = BASH_SESSION.lock().unwrap();
    
    // 如果会话未启动，先启动
    if !session.started {
        session.start()?;
    }
    
    // 执行命令
    session.run(&command)
} 