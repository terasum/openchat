use std::sync::Arc;

use std::process::Command;
use tauri::State;
use webbrowser::{open_browser, Browser};

use crate::db::{self, prisma_client::PrismaClient};

use crate::db::prisma_client::session;

pub type DbState<'a> = State<'a, Arc<PrismaClient>>;

// -------------- db releated commands -----------------

/// 定义一个包装器函数来处理异步调用
#[tauri::command]
#[specta::specta]
pub async fn wrap_get_session_list(
    state: State<'_, Arc<PrismaClient>>,
    start: i32,
    end: i32,
) -> Result<Vec<session::Data>, String> {
    let db_client = Arc::clone(&state);
    let result = db::command_session::get_session_list(&db_client, start.into(), end.into()).await;
    return result;
}

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
