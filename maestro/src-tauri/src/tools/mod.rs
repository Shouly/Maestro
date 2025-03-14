pub mod error;
pub mod bash;
pub mod computer;
pub mod edit;

// 重新导出错误类型，方便使用
pub use error::{ToolError, ToolResult}; 