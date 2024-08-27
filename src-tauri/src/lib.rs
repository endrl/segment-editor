mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let context = tauri::generate_context!();
    let builder = tauri::Builder::default();

    builder
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![commands::close_splashscreen])
        .run(context)
        .expect("error while running tauri application");
}
