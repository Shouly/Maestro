// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod tools;
mod utils;

use tools::bash::{
    execute_command, execute_command_async, get_environment_variables,
    get_current_directory, check_command_exists, execute_command_background,
    list_background_processes, terminate_background_process, monitor_process,
    get_command_history, search_command_history, rerun_command,
    start_bash_session, stop_bash_session, restart_bash_session, execute_in_session
};
use tools::computer::{
    get_system_info, get_processes, get_system_load, get_boot_time,
    take_screenshot, get_mouse_position, move_mouse, mouse_click,
    mouse_double_click, mouse_down, mouse_up, mouse_drag, mouse_scroll,
    key_press, key_sequence, key_down, key_up, type_text, wait, key_combo,
    mouse_triple_click, mouse_scroll_direction, wait_and_action,
    get_clipboard, set_clipboard, set_scaling_config, get_scaling_config, scale_coordinates
};
use tools::edit::{
    read_file_content, write_file_content, append_file_content, delete_file,
    create_directory, get_file_info, list_directory, copy_file, move_file,
    rename_file, search_files, str_replace, insert_at_line, undo_edit
};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // Bash工具
            execute_command,
            execute_command_async,
            execute_command_background,
            list_background_processes,
            terminate_background_process,
            get_environment_variables,
            get_current_directory,
            check_command_exists,
            monitor_process,
            get_command_history,
            search_command_history,
            rerun_command,
            start_bash_session,
            stop_bash_session,
            restart_bash_session,
            execute_in_session,
            
            // 系统信息工具
            get_system_info,
            get_processes,
            get_system_load,
            get_boot_time,
            take_screenshot,
            get_mouse_position,
            move_mouse,
            mouse_click,
            mouse_double_click,
            mouse_triple_click,
            mouse_down,
            mouse_up,
            mouse_drag,
            mouse_scroll,
            mouse_scroll_direction,
            key_press,
            key_sequence,
            key_down,
            key_up,
            type_text,
            wait,
            wait_and_action,
            key_combo,
            get_clipboard,
            set_clipboard,
            set_scaling_config,
            get_scaling_config,
            scale_coordinates,
            
            // 文件编辑工具
            read_file_content,
            write_file_content,
            append_file_content,
            delete_file,
            create_directory,
            get_file_info,
            list_directory,
            copy_file,
            move_file,
            rename_file,
            search_files,
            str_replace,
            insert_at_line,
            undo_edit,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
