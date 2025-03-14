use crate::tools::ToolResult;
use base64::Engine;
use base64::engine::general_purpose::STANDARD;

/// 将Base64编码的图像数据转换为HTML可显示的格式
#[allow(dead_code)]
pub fn _image_to_data_url(image_data: &[u8], mime_type: &str) -> ToolResult<String> {
    let base64 = STANDARD.encode(image_data);
    Ok(format!("data:{};base64,{}", mime_type, base64))
}

/// 格式化命令输出，使其在前端显示更友好
#[allow(dead_code)]
pub fn _format_command_output(output: &str) -> String {
    // 简单替换，可以根据需要扩展
    output.replace("\n", "<br>").replace(" ", "&nbsp;")
}

/// 安全地获取环境变量，如果不存在则返回默认值
#[allow(dead_code)]
pub fn _get_env_or_default(key: &str, default: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| default.to_string())
} 