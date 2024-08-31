// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use futures::executor;
use std::sync::Arc;
use tauri::Manager; // 0.3.1

mod commands;
mod db;
mod tray;


#[cfg(all(debug_assertions, not(target_os = "windows")))]
use specta::functions::collect_types;

#[cfg(all(debug_assertions, not(target_os = "windows")))]
use tauri_specta::ts;

fn generate_bindings() {
    println!("cargo:rerun-if-changed=../src/rust-bindings.ts");
    ts::export(
        collect_types![commands::wrap_get_session_list],
        "../src/rust-bindings.ts",
    )
    .unwrap();
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    #[cfg(debug_assertions)]
    #[cfg(all(debug_assertions, not(target_os = "windows")))]
    generate_bindings();
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "windows")]
            set_shadow(&_app.get_window("main").unwrap(), true).expect("Unsupported platform!");

            let path_string = db::get_db_path(&_app);
            println!("[init] database path {}", path_string);

            let init_result = executor::block_on(db::init_db(path_string));
            match init_result {
                Ok(prisma_client) => {
                    _app.manage(Arc::new(prisma_client));
                    println!("[init] database init ok");
                }
                Err(err) => {
                    println!("[init] database init error {}", err);
                }
            }

            Ok(())
        })
        .system_tray(tray::main_menu())
        .plugin(tauri_plugin_system_info::init())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            let window = app.get_window("main").unwrap();
            window.show().unwrap();
            window.unminimize().unwrap();
            window.set_focus().unwrap();
        }))
        .invoke_handler(tauri::generate_handler![
            commands::show_in_folder,
            commands::open_url,
            commands::open_devtools,
            commands::wrap_get_session_list,
            commands::wrap_get_session_data_by_id,
        ])
        .on_system_tray_event(tray::handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
