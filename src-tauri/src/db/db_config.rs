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

pub async fn get_app_settings(
    db: &PrismaClient,
    key: String,
) -> Result<Option<settings::Data>, String> {
    return db
        .settings()
        .find_first(vec![settings::key::equals(key)])
        .exec()
        .await
        .map_err(|e| e.to_string());
}

pub async fn set_app_settings(db: &PrismaClient, key: String, value: String) -> Result<(), String> {
    return db
        .settings()
        .upsert(settings::key::equals(key.clone()),
            settings::create(
                key.to_string(),
                value.to_string(),
                vec![
                    settings::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
                    settings::created_at::set(chrono::DateTime::from(chrono::Utc::now())),
                ],
            ),
            // Vec of updates to apply if record already exists
            vec![
                settings::key::set(key),
                settings::value::set(value),
                settings::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map(|_| ())
        .map_err(|e| e.to_string());
}
