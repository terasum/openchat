// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use futures::executor;
// use log::info;
use tauri::api::path::{resolve_path, BaseDirectory};
use tauri::Manager; // 0.3.1

mod commands;
mod db;
mod tray;

#[tokio::main]
async fn main() -> std::io::Result<()> {
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

            let init_result = executor::block_on(db::init_db());
            match init_result {
                Ok(_) => {
                    println!("[init] database init ok");
                }
                Err(err) => {
                    println!("[init] database init error {}", err);
                }
            }

            Ok(())
        })
        .system_tray(tray::main_menu())
        // .plugin(tauri_plugin_sql::Builder::default().build())
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

    Ok(())
}

// fn main() {

//     let init_result = db::init_db().await;
//     match init_result {
//         Ok(result) => {}
//         Err(err) => {
//             println!("{}", err);
//         }
//     }

// }
