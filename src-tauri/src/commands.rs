use std::sync::Arc;

use std::process::Command;
use tauri::State;
use webbrowser::{open_browser, Browser};

use crate::db::prisma_client::PrismaClient;

use crate::db::prisma_client::prompt;
use crate::db::prisma_client::session;
use crate::db::prisma_client::session_data;
use crate::db::prisma_client::settings;

use crate::db::db_config;
use crate::db::db_session;
use crate::db::db_prompt;

/// 定义一个包装器函数来处理异步调用
#[tauri::command]
#[specta::specta]
pub async fn wrap_get_session_list(
    state: State<'_, Arc<PrismaClient>>,
    start: i32,
    end: i32,
) -> Result<Vec<session::Data>, String> {
    let db_client = Arc::clone(&state);
    let result = db_session::get_session_list(&db_client, start.into(), end.into()).await;
    return result;
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_new_session(
    state: State<'_, Arc<PrismaClient>>,
    data: session::Data,
) -> Result<session::Data, String> {
    let db_client = Arc::clone(&state);
    let result = db_session::new_session(&db_client, data).await;
    return result;
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_update_session(
    state: State<'_, Arc<PrismaClient>>,
    data: session::Data,
) -> Result<session::Data, String> {
    let db_client = Arc::clone(&state);
    let result = db_session::update_session(&db_client, data).await;
    return result;
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_delete_session(
    state: State<'_, Arc<PrismaClient>>,
    id: String,
) -> Result<session::Data, String> {
    let db_client = Arc::clone(&state);
    let result = db_session::delete_session(&db_client, id).await;
    return result;
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_get_session_data_by_id(
    state: State<'_, Arc<PrismaClient>>,
    id: String,
) -> Result<Vec<session_data::Data>, String> {
    let db_client = Arc::clone(&state);
    let result = db_session::get_session_data_by_id(&db_client, id.into()).await;
    return result;
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_save_session_data(
    state: State<'_, Arc<PrismaClient>>,
    session_id: String,
    data: session_data::Data,
) -> Result<session_data::Data, String> {
    let db_client = Arc::clone(&state);
    return db_session::save_session_data(&db_client, session_id, data).await
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_update_session_data(
    state: State<'_, Arc<PrismaClient>>,
    data: session_data::Data,
) -> Result<session_data::Data, String> {
    let db_client = Arc::clone(&state);
    let result = db_session::update_session_data(&db_client, data).await;
    match result {
        Ok(result) => Ok(result),
        Err(err) => {
            println!("[rs.sql] Exec wrap_update_session_data error: {}", err);
            Err(err)
        }
    }
}

// -----------  db prompts  --------

/// 定义一个包装器函数来处理异步调用
#[tauri::command]
#[specta::specta]
pub async fn wrap_get_prompt_list(
    state: State<'_, Arc<PrismaClient>>,
    start: i32,
    end: i32,
) -> Result<Vec<prompt::Data>, String> {
    let db_client = Arc::clone(&state);
    db_prompt::get_prompt_list(&db_client, start.into(), end.into()).await
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_update_prompt(
    state: State<'_, Arc<PrismaClient>>,
    data: prompt::Data,
) -> Result<prompt::Data, String> {
    let db_client = Arc::clone(&state);
    db_prompt::update_prompt(&db_client, data).await
}

// ----------- config db commands --------
#[tauri::command]
#[specta::specta]
pub async fn wrap_get_app_config(
    state: State<'_, Arc<PrismaClient>>,
) -> Result<settings::Data, String> {
    let db_client = Arc::clone(&state);
    let result = db_config::get_app_config(&db_client).await;
    match result {
        Ok(data) => {
            if data.is_none() {
                return Err("No config found".to_string());
            } else {
                return Ok(data.unwrap());
            }
        }
        Err(err) => {
            return Err(err.to_string());
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn wrap_update_app_config(
    state: State<'_, Arc<PrismaClient>>,
    config: settings::Data,
) -> Result<(), String> {
    let db_client = Arc::clone(&state);
    let result = db_config::update_app_config(&db_client, config).await;
    return result;
}

//------------ app commands -----------

#[tauri::command]
pub async fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path]) // The comma after select is not a typo
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        use std::fs::metadata;
        use std::path::PathBuf;
        if path.contains(",") {
            // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
            let new_path = match metadata(&path).unwrap().is_dir() {
                true => path,
                false => {
                    let mut path2 = PathBuf::from(path);
                    path2.pop();
                    path2.into_os_string().into_string().unwrap()
                }
            };
            Command::new("xdg-open").arg(&new_path).spawn().unwrap();
        } else {
            Command::new("dbus-send")
                .args([
                    "--session",
                    "--dest=org.freedesktop.FileManager1",
                    "--type=method_call",
                    "/org/freedesktop/FileManager1",
                    "org.freedesktop.FileManager1.ShowItems",
                    format!("array:string:file://{path}").as_str(),
                    "string:\"\"",
                ])
                .spawn()
                .unwrap();
        }
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").args(["-R", &path]).spawn().unwrap();
    }
}

#[tauri::command]
pub fn open_devtools(window: tauri::Window) {
    window.open_devtools();
}

// 浏览器打开
#[tauri::command]
pub fn open_url(url: &str) {
    if open_browser(Browser::Default, &url).is_ok() {
        println!("{}", &url)
    }
}
