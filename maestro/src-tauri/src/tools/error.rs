use thiserror::Error;
use serde::Serialize;

/// 工具错误类型
#[derive(Error, Debug, Serialize)]
pub enum ToolError {
    #[error("IO错误: {0}")]
    Io(String),

    #[error("序列化错误: {0}")]
    Serialization(String),

    #[error("屏幕截图错误: {0}")]
    _Screenshot(String),

    #[error("鼠标/键盘控制错误: {0}")]
    _Input(String),

    #[error("命令执行错误: {0}")]
    Command(String),

    #[error("文件操作错误: {0}")]
    _FileOperation(String),

    #[error("参数错误: {0}")]
    InvalidArgument(String),

    #[error("权限错误: {0}")]
    _Permission(String),

    #[error("未知错误: {0}")]
    _Unknown(String),
}

// 从 std::io::Error 转换
impl From<std::io::Error> for ToolError {
    fn from(err: std::io::Error) -> Self {
        ToolError::Io(err.to_string())
    }
}

// 从 serde_json::Error 转换
impl From<serde_json::Error> for ToolError {
    fn from(err: serde_json::Error) -> Self {
        ToolError::Serialization(err.to_string())
    }
}

/// 结果类型别名
pub type ToolResult<T> = Result<T, ToolError>;

/// 从字符串创建命令错误
pub fn cmd_err<T>(message: impl Into<String>) -> ToolResult<T> {
    Err(ToolError::Command(message.into()))
}

/// 从字符串创建参数错误
pub fn arg_err<T>(message: impl Into<String>) -> ToolResult<T> {
    Err(ToolError::InvalidArgument(message.into()))
}

/// 从字符串创建IO错误
pub fn io_err<T>(message: impl Into<String>) -> ToolResult<T> {
    Err(ToolError::Io(message.into()))
} 