use thiserror::Error;

/// 工具错误类型
#[derive(Error, Debug)]
pub enum ToolError {
    #[error("IO错误: {0}")]
    Io(#[from] std::io::Error),

    #[error("序列化错误: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("屏幕截图错误: {0}")]
    Screenshot(String),

    #[error("鼠标/键盘控制错误: {0}")]
    Input(String),

    #[error("命令执行错误: {0}")]
    Command(String),

    #[error("文件操作错误: {0}")]
    FileOperation(String),

    #[error("参数错误: {0}")]
    InvalidArgument(String),

    #[error("权限错误: {0}")]
    Permission(String),

    #[error("未知错误: {0}")]
    Unknown(String),
}

/// 结果类型别名
pub type ToolResult<T> = Result<T, ToolError>;

/// 从字符串创建错误
pub fn err<T>(message: impl Into<String>) -> ToolResult<T> {
    Err(ToolError::Unknown(message.into()))
}

/// 从字符串创建命令错误
pub fn cmd_err<T>(message: impl Into<String>) -> ToolResult<T> {
    Err(ToolError::Command(message.into()))
}

/// 从字符串创建文件操作错误
pub fn file_err<T>(message: impl Into<String>) -> ToolResult<T> {
    Err(ToolError::FileOperation(message.into()))
}

/// 从字符串创建参数错误
pub fn arg_err<T>(message: impl Into<String>) -> ToolResult<T> {
    Err(ToolError::InvalidArgument(message.into()))
} 