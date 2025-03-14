use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;

use super::error::{ToolResult, io_err, arg_err};

// 全局文件历史记录，用于撤销操作
static FILE_HISTORY: Lazy<Mutex<HashMap<String, Vec<String>>>> = Lazy::new(|| {
    Mutex::new(HashMap::new())
});

// 添加文件内容到历史记录
fn add_to_history(path: &str, content: String) {
    if let Ok(mut history) = FILE_HISTORY.lock() {
        history.entry(path.to_string())
            .or_insert_with(Vec::new)
            .push(content);
        
        // 限制历史记录长度，避免内存泄漏
        if history.get(path).unwrap().len() > 10 {
            let entries = history.get_mut(path).unwrap();
            entries.remove(0);
        }
    }
}

/// 文件信息
#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    /// 文件名
    pub name: String,
    /// 文件路径
    pub path: String,
    /// 文件大小（字节）
    pub size: u64,
    /// 是否为目录
    pub is_dir: bool,
    /// 是否为文件
    pub is_file: bool,
    /// 是否为符号链接
    pub is_symlink: bool,
    /// 文件扩展名
    pub extension: Option<String>,
    /// 最后修改时间（Unix时间戳，毫秒）
    pub modified: Option<u64>,
    /// 创建时间（Unix时间戳，毫秒）
    pub created: Option<u64>,
}

/// 读取文件内容，可选择指定行范围
#[tauri::command]
pub fn read_file_content(path: String, view_range: Option<(usize, i32)>) -> ToolResult<String> {
    let path_obj = Path::new(&path);
    
    if !path_obj.exists() {
        return arg_err(format!("文件不存在: {}", path));
    }
    
    if path_obj.is_dir() {
        return arg_err(format!("路径是目录，不能读取内容: {}", path));
    }
    
    // 读取文件内容
    let file_content = match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(err) => return io_err(format!("无法读取文件 {}: {}", path, err)),
    };
    
    // 如果没有指定行范围，返回全部内容
    if view_range.is_none() {
        return Ok(file_content);
    }
    
    let (init_line, final_line) = view_range.unwrap();
    let file_lines: Vec<&str> = file_content.lines().collect();
    let n_lines_file = file_lines.len();
    
    // 验证行范围
    if init_line < 1 || init_line > n_lines_file {
        return arg_err(format!("起始行 {} 超出文件行数范围 [1, {}]", init_line, n_lines_file));
    }
    
    // 处理结束行
    let actual_final_line = if final_line == -1 {
        n_lines_file
    } else if final_line as usize > n_lines_file {
        return arg_err(format!("结束行 {} 超出文件行数 {}", final_line, n_lines_file));
    } else if final_line as usize < init_line {
        return arg_err(format!("结束行 {} 小于起始行 {}", final_line, init_line));
    } else {
        final_line as usize
    };
    
    // 提取指定范围的行
    let result = file_lines[init_line - 1..actual_final_line]
        .iter()
        .enumerate()
        .map(|(i, line)| format!("{:6}\t{}", i + init_line, line))
        .collect::<Vec<String>>()
        .join("\n");
    
    Ok(result)
}

/// 写入文件内容
#[tauri::command]
pub fn write_file_content(path: String, content: String) -> ToolResult<()> {
    // 确保目录存在
    if let Some(parent) = Path::new(&path).parent() {
        if !parent.exists() {
            if let Err(err) = fs::create_dir_all(parent) {
                return io_err(format!("无法创建目录 {}: {}", parent.display(), err));
            }
        }
    }
    
    match fs::write(&path, content) {
        Ok(_) => Ok(()),
        Err(err) => io_err(format!("无法写入文件 {}: {}", path, err)),
    }
}

/// 追加文件内容
#[tauri::command]
pub fn append_file_content(path: String, content: String) -> ToolResult<()> {
    // 确保目录存在
    if let Some(parent) = Path::new(&path).parent() {
        if !parent.exists() {
            if let Err(err) = fs::create_dir_all(parent) {
                return io_err(format!("无法创建目录 {}: {}", parent.display(), err));
            }
        }
    }
    
    // 如果文件不存在，创建文件
    if !Path::new(&path).exists() {
        if let Err(err) = fs::write(&path, &content) {
            return io_err(format!("无法创建文件 {}: {}", path, err));
        }
        return Ok(());
    }
    
    // 读取现有内容
    let existing_content = match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(err) => return io_err(format!("无法读取文件 {}: {}", path, err)),
    };
    
    // 追加内容
    let new_content = format!("{}{}", existing_content, content);
    
    // 写入文件
    match fs::write(&path, new_content) {
        Ok(_) => Ok(()),
        Err(err) => io_err(format!("无法写入文件 {}: {}", path, err)),
    }
}

/// 删除文件
#[tauri::command]
pub fn delete_file(path: String) -> ToolResult<()> {
    let path = Path::new(&path);
    
    if !path.exists() {
        return Ok(());
    }
    
    if path.is_dir() {
        match fs::remove_dir_all(path) {
            Ok(_) => Ok(()),
            Err(err) => io_err(format!("无法删除目录 {}: {}", path.display(), err)),
        }
    } else {
        match fs::remove_file(path) {
            Ok(_) => Ok(()),
            Err(err) => io_err(format!("无法删除文件 {}: {}", path.display(), err)),
        }
    }
}

/// 创建目录
#[tauri::command]
pub fn create_directory(path: String) -> ToolResult<()> {
    match fs::create_dir_all(&path) {
        Ok(_) => Ok(()),
        Err(err) => io_err(format!("无法创建目录 {}: {}", path, err)),
    }
}

/// 获取文件信息
#[tauri::command]
pub fn get_file_info(path: String) -> ToolResult<FileInfo> {
    let path_obj = Path::new(&path);
    
    if !path_obj.exists() {
        return arg_err(format!("文件不存在: {}", path));
    }
    
    let metadata = match fs::metadata(&path) {
        Ok(metadata) => metadata,
        Err(err) => return io_err(format!("无法获取文件元数据 {}: {}", path, err)),
    };
    
    let file_name = path_obj.file_name()
        .map(|name| name.to_string_lossy().to_string())
        .unwrap_or_else(|| String::from(""));
    
    let extension = path_obj.extension()
        .map(|ext| ext.to_string_lossy().to_string());
    
    let modified = metadata.modified().ok()
        .map(|time| time.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64);
    
    let created = metadata.created().ok()
        .map(|time| time.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64);
    
    Ok(FileInfo {
        name: file_name,
        path: path_obj.to_string_lossy().to_string(),
        size: metadata.len(),
        is_dir: metadata.is_dir(),
        is_file: metadata.is_file(),
        is_symlink: metadata.file_type().is_symlink(),
        extension,
        modified,
        created,
    })
}

/// 列出目录内容
#[tauri::command]
pub fn list_directory(path: String) -> ToolResult<Vec<FileInfo>> {
    let path_obj = Path::new(&path);
    
    if !path_obj.exists() {
        return arg_err(format!("目录不存在: {}", path));
    }
    
    if !path_obj.is_dir() {
        return arg_err(format!("路径不是目录: {}", path));
    }
    
    let mut files = Vec::new();
    
    for entry in fs::read_dir(path_obj).map_err(|err| io_err(format!("无法读取目录 {}: {}", path, err)))? {
        let entry = entry.map_err(|err| io_err(format!("无法读取目录项: {}", err)))?;
        let entry_path = entry.path();
        
        let metadata = match entry.metadata() {
            Ok(metadata) => metadata,
            Err(_) => continue, // 跳过无法获取元数据的文件
        };
        
        let file_name = entry_path.file_name()
            .map(|name| name.to_string_lossy().to_string())
            .unwrap_or_else(|| String::from(""));
        
        let extension = entry_path.extension()
            .map(|ext| ext.to_string_lossy().to_string());
        
        let modified = metadata.modified().ok()
            .map(|time| time.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64);
        
        let created = metadata.created().ok()
            .map(|time| time.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64);
        
        files.push(FileInfo {
            name: file_name,
            path: entry_path.to_string_lossy().to_string(),
            size: metadata.len(),
            is_dir: metadata.is_dir(),
            is_file: metadata.is_file(),
            is_symlink: metadata.file_type().is_symlink(),
            extension,
            modified,
            created,
        });
    }
    
    Ok(files)
}

/// 复制文件
#[tauri::command]
pub fn copy_file(source: String, destination: String) -> ToolResult<()> {
    let source_path = Path::new(&source);
    let dest_path = Path::new(&destination);
    
    if !source_path.exists() {
        return arg_err(format!("源文件不存在: {}", source));
    }
    
    // 确保目标目录存在
    if let Some(parent) = dest_path.parent() {
        if !parent.exists() {
            if let Err(err) = fs::create_dir_all(parent) {
                return io_err(format!("无法创建目标目录 {}: {}", parent.display(), err));
            }
        }
    }
    
    if source_path.is_dir() {
        copy_dir_recursive(source_path, dest_path)?;
    } else {
        if let Err(err) = fs::copy(source_path, dest_path) {
            return io_err(format!("无法复制文件 {} 到 {}: {}", source, destination, err));
        }
    }
    
    Ok(())
}

/// 递归复制目录
fn copy_dir_recursive(source: &Path, destination: &Path) -> ToolResult<()> {
    if !destination.exists() {
        if let Err(err) = fs::create_dir_all(destination) {
            return io_err(format!("无法创建目标目录 {}: {}", destination.display(), err));
        }
    }
    
    for entry in fs::read_dir(source).map_err(|err| io_err(format!("无法读取源目录 {}: {}", source.display(), err)))? {
        let entry = entry.map_err(|err| io_err(format!("无法读取目录项: {}", err)))?;
        let entry_path = entry.path();
        
        let file_name = entry_path.file_name().unwrap();
        let dest_path = destination.join(file_name);
        
        if entry_path.is_dir() {
            copy_dir_recursive(&entry_path, &dest_path)?;
        } else {
            if let Err(err) = fs::copy(&entry_path, &dest_path) {
                return io_err(format!("无法复制文件 {} 到 {}: {}", entry_path.display(), dest_path.display(), err));
            }
        }
    }
    
    Ok(())
}

/// 移动文件
#[tauri::command]
pub fn move_file(source: String, destination: String) -> ToolResult<()> {
    let source_path = Path::new(&source);
    let dest_path = Path::new(&destination);
    
    if !source_path.exists() {
        return arg_err(format!("源文件不存在: {}", source));
    }
    
    // 确保目标目录存在
    if let Some(parent) = dest_path.parent() {
        if !parent.exists() {
            if let Err(err) = fs::create_dir_all(parent) {
                return io_err(format!("无法创建目标目录 {}: {}", parent.display(), err));
            }
        }
    }
    
    if let Err(err) = fs::rename(source_path, dest_path) {
        return io_err(format!("无法移动文件 {} 到 {}: {}", source, destination, err));
    }
    
    Ok(())
}

/// 重命名文件
#[tauri::command]
pub fn rename_file(path: String, new_name: String) -> ToolResult<()> {
    let path_obj = Path::new(&path);
    
    if !path_obj.exists() {
        return arg_err(format!("文件不存在: {}", path));
    }
    
    let parent = match path_obj.parent() {
        Some(parent) => parent,
        None => return arg_err(format!("无法获取父目录: {}", path)),
    };
    
    let new_path = parent.join(new_name);
    
    if let Err(err) = fs::rename(path_obj, &new_path) {
        return io_err(format!("无法重命名文件 {} 到 {}: {}", path, new_path.display(), err));
    }
    
    Ok(())
}

/// 搜索文件
#[tauri::command]
pub fn search_files(dir: String, pattern: String) -> ToolResult<Vec<FileInfo>> {
    let dir_path = Path::new(&dir);
    
    if !dir_path.exists() || !dir_path.is_dir() {
        return arg_err(format!("目录不存在: {}", dir));
    }
    
    let mut results = Vec::new();
    search_files_recursive(dir_path, &pattern, &mut results)?;
    
    Ok(results)
}

/// 递归搜索文件
fn search_files_recursive(dir: &Path, pattern: &str, results: &mut Vec<FileInfo>) -> ToolResult<()> {
    for entry in fs::read_dir(dir).map_err(|err| io_err(format!("无法读取目录 {}: {}", dir.display(), err)))? {
        let entry = entry.map_err(|err| io_err(format!("无法读取目录项: {}", err)))?;
        let path = entry.path();
        
        let file_name = path.file_name()
            .map(|name| name.to_string_lossy().to_string())
            .unwrap_or_else(|| String::from(""));
        
        if file_name.contains(pattern) {
            let metadata = match fs::metadata(&path) {
                Ok(metadata) => metadata,
                Err(_) => continue, // 跳过无法获取元数据的文件
            };
            
            let extension = path.extension()
                .map(|ext| ext.to_string_lossy().to_string());
            
            let modified = metadata.modified().ok()
                .map(|time| time.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64);
            
            let created = metadata.created().ok()
                .map(|time| time.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64);
            
            results.push(FileInfo {
                name: file_name,
                path: path.to_string_lossy().to_string(),
                size: metadata.len(),
                is_dir: metadata.is_dir(),
                is_file: metadata.is_file(),
                is_symlink: metadata.file_type().is_symlink(),
                extension,
                modified,
                created,
            });
        }
        
        if path.is_dir() {
            search_files_recursive(&path, pattern, results)?;
        }
    }
    
    Ok(())
}

/// 字符串替换 - 替换文件中的特定字符串
#[tauri::command]
pub fn str_replace(path: String, old_str: String, new_str: String) -> ToolResult<String> {
    let path_obj = Path::new(&path);
    
    if !path_obj.exists() {
        return arg_err(format!("文件不存在: {}", path));
    }
    
    if path_obj.is_dir() {
        return arg_err(format!("路径是目录，不能进行字符串替换: {}", path));
    }
    
    // 读取文件内容
    let file_content = match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(err) => return io_err(format!("无法读取文件 {}: {}", path, err)),
    };
    
    // 检查旧字符串是否存在于文件中
    let occurrences = file_content.matches(&old_str).count();
    if occurrences == 0 {
        return arg_err(format!("未执行替换，文件 {} 中未找到字符串 '{}'", path, old_str));
    }
    
    // 检查是否有多个匹配项
    if occurrences > 1 {
        // 找出所有匹配行
        let lines: Vec<usize> = file_content.lines()
            .enumerate()
            .filter(|(_, line)| line.contains(&old_str))
            .map(|(idx, _)| idx + 1)
            .collect();
            
        return arg_err(format!("未执行替换。在文件 {} 的第 {:?} 行找到多个 '{}' 匹配项。请确保替换字符串是唯一的", path, lines, old_str));
    }
    
    // 保存原始内容到历史记录
    add_to_history(&path, file_content.clone());
    
    // 替换字符串
    let new_content = file_content.replace(&old_str, &new_str);
    
    // 写入新内容
    if let Err(err) = fs::write(&path, &new_content) {
        return io_err(format!("无法写入文件 {}: {}", path, err));
    }
    
    // 创建替换部分的片段
    let replacement_line = file_content.split(&old_str).next().unwrap().lines().count();
    let start_line = if replacement_line > 4 { replacement_line - 4 } else { 0 };
    let end_line = replacement_line + 4 + new_str.lines().count();
    
    let snippet: String = new_content.lines()
        .skip(start_line)
        .take(end_line - start_line)
        .enumerate()
        .map(|(i, line)| format!("{:6}\t{}", i + start_line + 1, line))
        .collect::<Vec<String>>()
        .join("\n");
    
    Ok(format!("文件 {} 已编辑。\n以下是修改部分的片段：\n{}\n请检查更改是否符合预期。如有需要，可以再次编辑文件。", path, snippet))
}

/// 在指定行插入内容
#[tauri::command]
pub fn insert_at_line(path: String, insert_line: usize, new_str: String) -> ToolResult<String> {
    let path_obj = Path::new(&path);
    
    if !path_obj.exists() {
        return arg_err(format!("文件不存在: {}", path));
    }
    
    if path_obj.is_dir() {
        return arg_err(format!("路径是目录，不能进行内容插入: {}", path));
    }
    
    // 读取文件内容
    let file_content = match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(err) => return io_err(format!("无法读取文件 {}: {}", path, err)),
    };
    
    // 将文件内容分割为行
    let file_lines: Vec<&str> = file_content.lines().collect();
    let n_lines_file = file_lines.len();
    
    // 检查插入行是否有效
    if insert_line > n_lines_file {
        return arg_err(format!("插入行 {} 超出文件行数 {}", insert_line, n_lines_file));
    }
    
    // 保存原始内容到历史记录
    add_to_history(&path, file_content.clone());
    
    // 将新内容分割为行
    let new_lines: Vec<&str> = new_str.lines().collect();
    
    // 构建新的文件内容
    let mut new_file_lines = Vec::new();
    new_file_lines.extend_from_slice(&file_lines[0..insert_line]);
    new_file_lines.extend_from_slice(&new_lines);
    new_file_lines.extend_from_slice(&file_lines[insert_line..]);
    
    let new_content = new_file_lines.join("\n");
    
    // 写入新内容
    if let Err(err) = fs::write(&path, &new_content) {
        return io_err(format!("无法写入文件 {}: {}", path, err));
    }
    
    // 创建插入部分的片段
    let start_line = if insert_line > 4 { insert_line - 4 } else { 0 };
    let end_line = insert_line + new_lines.len() + 4;
    let end_line = if end_line > new_file_lines.len() { new_file_lines.len() } else { end_line };
    
    let snippet: String = new_file_lines
        .iter()
        .skip(start_line)
        .take(end_line - start_line)
        .enumerate()
        .map(|(i, line)| format!("{:6}\t{}", i + start_line + 1, line))
        .collect::<Vec<String>>()
        .join("\n");
    
    Ok(format!("文件 {} 已编辑。\n以下是修改部分的片段：\n{}\n请检查更改是否符合预期（正确的缩进、没有重复的行等）。如有需要，可以再次编辑文件。", path, snippet))
}

/// 撤销上一次编辑
#[tauri::command]
pub fn undo_edit(path: String) -> ToolResult<String> {
    let path_obj = Path::new(&path);
    
    // 获取文件历史记录
    let mut history_opt = None;
    
    if let Ok(mut history) = FILE_HISTORY.lock() {
        if let Some(file_history) = history.get_mut(&path) {
            if !file_history.is_empty() {
                history_opt = Some(file_history.pop().unwrap());
            }
        }
    }
    
    // 检查是否有历史记录
    if history_opt.is_none() {
        return arg_err(format!("没有找到文件 {} 的编辑历史", path));
    }
    
    let old_content = history_opt.unwrap();
    
    // 写入旧内容
    if let Err(err) = fs::write(&path, &old_content) {
        return io_err(format!("无法写入文件 {}: {}", path, err));
    }
    
    // 创建文件内容的片段
    let snippet: String = old_content.lines()
        .take(10)  // 只显示前10行
        .enumerate()
        .map(|(i, line)| format!("{:6}\t{}", i + 1, line))
        .collect::<Vec<String>>()
        .join("\n");
    
    Ok(format!("成功撤销对文件 {} 的上一次编辑。\n以下是文件内容片段：\n{}\n", path, snippet))
} 