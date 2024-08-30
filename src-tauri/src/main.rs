// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;
use tauri::api::path::{resolve_path, BaseDirectory};
use tauri::Manager;

mod commands;
mod nativesql;
mod tray;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "windows")]
            set_shadow(&_app.get_window("main").unwrap(), true).expect("Unsupported platform!");

            #[cfg(debug_assertions)]
            let path = resolve_path(
                &_app.config(),
                _app.package_info(),
                &_app.env(),
                "openchat-dev.db",
                Some(BaseDirectory::AppData),
            )?;
            #[cfg(not(debug_assertions))]
            let path = resolve_path(
                &_app.config(),
                _app.package_info(),
                &_app.env(),
                "openchat.db",
                Some(BaseDirectory::AppData),
            )?;

            // init databases
            let result = nativesql::init_app(&path);
            match result {
                Ok(()) => {
                    info!("App started done.");
                }
                Err(err) => {
                    info!("App started faild. {}", err);
                }
            }
            Ok(())
        })
        .system_tray(tray::main_menu())
        .plugin(tauri_plugin_sql::Builder::default().build())
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
        ])
        .on_system_tray_event(tray::handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
