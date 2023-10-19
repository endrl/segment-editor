// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    let context = tauri::generate_context!();
    let builder = tauri::Builder::default();

    builder
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![commands::close_splashscreen])
        .run(context)
        .expect("error while running tauri application");
}
