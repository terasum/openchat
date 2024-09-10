use std::vec;

use crate::db::prisma_client::settings;
use crate::db::prisma_client::PrismaClient;
use prisma_client_rust::chrono;

pub async fn get_app_config(
    db: &PrismaClient,
) -> Result<std::option::Option<settings::Data>, String> {
    return db
        .settings()
        .find_first(vec![settings::id::equals(1)])
        .exec()
        .await
        .map_err(|e| e.to_string());
}

pub async fn update_app_config(db: &PrismaClient, config: settings::Data) -> Result<(), String> {
    return db
        .settings()
        .update(
            settings::id::equals(1),
            vec![
                settings::key::set(config.key),
                settings::value::set(config.value),
                settings::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map(|_| ())
        .map_err(|e| e.to_string());
}
