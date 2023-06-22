// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{utils::config::AppUrl, WindowUrl};

mod commands;

fn main() {
    let mut context = tauri::generate_context!();
    let mut builder = tauri::Builder::default();

    if cfg!(not(debug_assertions)) {
        let port = 43852;
        let url = WindowUrl::External(format!("http://localhost:{}", port).parse().unwrap());

        // update url and add plugin
        builder = builder.plugin(tauri_plugin_localhost::Builder::new(port).build());
        context.config_mut().build.dist_dir = AppUrl::Url(url.clone());
    }

    builder
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![commands::close_splashscreen])
        .run(context)
        .expect("error while running tauri application");
}
