// Stops the client from outputting a huge number of warnings during compilation.
#[allow(warnings, unused)]
pub mod prisma_client;

use prisma_client::prompt;
use prisma_client::settings;
use prisma_client::PrismaClient;
use prisma_client_rust::NewClientError;
use prisma_client_rust::Raw;
use tauri::api::path::{resolve_path, BaseDirectory};
use tauri::App;
use tauri::Manager;

pub mod db_config;
pub mod db_prompt;
pub mod db_session;

pub fn get_db_path(_app: &App) -> String {
    #[cfg(debug_assertions)]
    let path = resolve_path(
        &_app.config(),
        _app.package_info(),
        &_app.env(),
        "openchat-data-dev.db",
        Some(BaseDirectory::AppData),
    );

    #[cfg(not(debug_assertions))]
    let path = resolve_path(
        &_app.config(),
        _app.package_info(),
        &_app.env(),
        "openchat-data.db",
        Some(BaseDirectory::AppData),
    );
    return path.unwrap().into_os_string().into_string().unwrap();
}

pub async fn init_db(db_path: String) -> Result<PrismaClient, String> {
    let client: Result<PrismaClient, NewClientError> = PrismaClient::_builder()
        .with_url(format!("file://{}", db_path))
        .build()
        .await;

    match client {
        Ok(client) => {
            // 初始化
            init_tables(&client).await.ok();
            init_default_prompt(&client).await.ok();
            init_config_table_version(&client).await.ok();
            return Ok(client);
        }
        Err(error) => {
            return Err(error.to_string());
        }
    }
}

async fn init_tables(client: &PrismaClient) -> Result<(), Box<dyn std::error::Error>> {
    const INIT_TABLE_SQL1: &str = r#"
-- CreateTable
CREATE TABLE IF NOT EXISTS "prompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL,
    "actived" BOOLEAN NOT NULL,
    "with_context" BOOLEAN NOT NULL,
    "with_context_size" INTEGER NOT NULL,
    "max_tokens" INTEGER NOT NULL,
    "top_p" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "opts" TEXT NOT NULL,
    "prehandle_script" TEXT NOT NULL,
    "labels" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"#;

    const INIT_TABLE_SQL2: &str = r#"
-- CreateTable
CREATE TABLE IF NOT EXISTS "session_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "message_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_data_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
"#;

    const INIT_TABLE_SQL3: &str = r#"
-- CreateTable
CREATE TABLE IF NOT EXISTS "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "prompt_id" INTEGER NOT NULL,
    "with_context" BOOLEAN NOT NULL,
    "with_context_size" INTEGER NOT NULL,
    "session_model" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"#;

    const INIT_TABLE_SQL4: &str = r#"
-- CreateTable
CREATE TABLE IF NOT EXISTS "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);"#;

    const INIT_TABLE_SQL4_INDEX: &str = r#"
-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
"#;

    const INIT_TABLE_WAL: &str = r#"
PRAGMA journal_mode=WAL;"#;

    client
        ._execute_raw(Raw::new(INIT_TABLE_SQL1, vec![]))
        .exec()
        .await
        .ok();
    client
        ._execute_raw(Raw::new(INIT_TABLE_SQL2, vec![]))
        .exec()
        .await
        .ok();
    client
        ._execute_raw(Raw::new(INIT_TABLE_SQL3, vec![]))
        .exec()
        .await
        .ok();
    client
        ._execute_raw(Raw::new(INIT_TABLE_SQL4, vec![]))
        .exec()
        .await
        .ok();
    client
        ._execute_raw(Raw::new(INIT_TABLE_SQL4_INDEX, vec![]))
        .exec()
        .await
        .ok();
    client
        ._execute_raw(Raw::new(INIT_TABLE_WAL, vec![]))
        .exec()
        .await
        .ok();

    Ok(())
}

async fn init_default_prompt(client: &PrismaClient) -> Result<(), String> {
    let prompt = client
        .prompt()
        .create(
            "ChatGPT".to_string(),
            "通用人工智能助理".to_string(),
            "作为通用人工智能帮助用户解决问题，回答简洁清晰，按照要点的方式输出，且以markdown格式输出。".to_string(),
            true,
            true,
            true,
            32,
            2500,
            "1".to_string(),
            "0.8".to_string(),
            "{}".to_string(),
            "".to_string(),
            "general".to_string(),
            vec![prompt::id::set(1)],
        )
        .exec()
        .await;

    match prompt {
        Ok(prompt_data) => {
            println!(
                "prompt init record inserted success, id: {}",
                prompt_data.id
            );
            return Ok(());
        }
        Err(error) => {
            println!("prompt init record inserted failed, {}", error.to_string());
            return Err(error.to_string());
        }
    }
}

async fn init_config_table_version(client: &PrismaClient) -> Result<(), String> {
    let version: &str = env!("CARGO_PKG_VERSION");
    let default_config = r#"{"model":{"model_provider":"openchat","model_name":"gpt-4o-mini","api_url":"https://proxy.openchat.dev/v1/chat/completions","api_key":"SK-<your-api-key>","secret_key":"","model_opts":{},"user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"},"appearance":{"language":"zh_CN","theme":"light"}}"#;
    let default_active_prompt_id = "1";
    let result1 = client
        .settings()
        .create(
            "app_config".to_string(),
            default_config.to_string(),
            vec![settings::id::set(1)],
        )
        .exec()
        .await;

    match result1 {
        Ok(data) => {
            println!("settings init app_config inserted: {}", data.id);
        }
        Err(_) => {
            println!("settings version exists, skip");
        }
    }

    let result2 = client
        .settings()
        .create(
            "version".to_string(),
            version.to_string(),
            vec![settings::id::set(2)],
        )
        .exec()
        .await;

    match result2 {
        Ok(data) => {
            println!("settings init version inserted: {}", data.id);
        }
        Err(_) => {
            println!("settings version exists, skip");
        }
    }

    let result3 = client
        .settings()
        .create(
            "active-prompt".to_string(),
            default_active_prompt_id.to_string(),
            vec![settings::id::set(3)],
        )
        .exec()
        .await;

    match result3 {
        Ok(data) => {
            println!("settings init default_active_prompt inserted: {}", data.id);
        }
        Err(_) => {
            println!("settings default_active_prompt exists, skip");
        }
    }
    return Ok(());

}
