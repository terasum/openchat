// Stops the client from outputting a huge number of warnings during compilation.
#[allow(warnings, unused)]
mod prisma_client;

use prisma_client::prompt;
use prisma_client::settings;
use prisma_client::PrismaClient;
use prisma_client_rust::NewClientError;

pub async fn init_db() -> Result<(), String> {
    let client: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;

    match client {
        Ok(client) => {
            init_default_prompt(&client).await.ok();
            init_config_table_version(&client).await.ok();
            return Ok(());
        }
        Err(error) => {
            return Err(error.to_string());
        }
    }
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
            println!("prompt init record inserted success, id: {}", prompt_data.id);
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

    let result = client.settings()
        .create(
            "version".to_string(),
            version.to_string(),
            vec![settings::id::set(1)],
        )
        .exec().await;

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
