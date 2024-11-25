use tauri_plugin_window_state::StateFlags;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let context = tauri::generate_context!();
    let builder = tauri::Builder::default();

    builder
        .plugin(
            tauri_plugin_window_state::Builder::new()
                .with_state_flags(
                    StateFlags::DECORATIONS
                        | StateFlags::FULLSCREEN
                        | StateFlags::MAXIMIZED
                        | StateFlags::POSITION
                        | StateFlags::SIZE,
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![commands::show_main_window])
        .run(context)
        .expect("error while running tauri application");
}
