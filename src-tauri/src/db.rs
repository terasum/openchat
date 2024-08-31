// Stops the client from outputting a huge number of warnings during compilation.
#[allow(warnings, unused)]
pub mod prisma_client;

use prisma_client::prompt;
use prisma_client::settings;
use prisma_client::PrismaClient;
use prisma_client_rust::NewClientError;
use tauri::api::path::{resolve_path, BaseDirectory};
use tauri::App;
use tauri::Manager;

use std::sync::{Mutex, OnceLock};

pub mod command_session;

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

async fn init_tables(client: &PrismaClient) -> Result<(),Box<dyn std::error::Error>> {
    client._migrate_resolve("20240831160915_init").await?;

    #[cfg(debug_assertions)]
    client._db_push().await?;
    #[cfg(not(debug_assertions))]
    client._migrate_deploy().await?;

    Ok(())
}

async fn init_default_prompt(client: &PrismaClient) -> Result<(), String> {
    let prompt = client
        .prompt()
        .create(
            "ChatGPT".to_string(),
            "通用AI智能助理".to_string(),
            "prompt".to_string(),
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

    let result = client
        .settings()
        .create(
            "version".to_string(),
            version.to_string(),
            vec![settings::id::set(1)],
        )
        .exec()
        .await;

    match result {
        Ok(data) => {
            println!("settings init version inserted: {}", data.id);
            return Ok(());
        }
        Err(error) => {
            println!("settings not created");
            return Err(error.to_string());
        }
    }
}
