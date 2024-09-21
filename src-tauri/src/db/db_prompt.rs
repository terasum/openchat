use crate::db::prisma_client::prompt;
use crate::db::prisma_client::PrismaClient;
use prisma_client_rust::chrono;
use prisma_client_rust::Direction;
use rand::distributions::{Alphanumeric, DistString};


pub async fn new_prompt(db: &PrismaClient) -> Result<prompt::Data, String> {
    let random_id = Alphanumeric.sample_string(&mut rand::thread_rng(), 16);

    db.prompt()
        .create(
            "New Prompt".to_string(),
            format!("默认描述-{}",random_id).to_string(),
            "".to_string(),
            false,
            false,
            true,
            32,
            2500,
            "1".to_string(),
            "0.8".to_string(),
            "{}".to_string(),
            "".to_string(),
            "default".to_string(),
            vec![
                prompt::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
                prompt::created_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string())
}

pub async fn get_prompt_list(
    db: &PrismaClient,
    offset: i64,
    size: i64,
) -> Result<Vec<prompt::Data>, String> {
    db.prompt()
        .find_many(vec![])
        .skip(offset)
        .take(size)
        .order_by(prompt::updated_at::order(Direction::Asc))
        .exec()
        .await
        .map_err(|e| e.to_string())
}

pub async fn update_prompt(db: &PrismaClient, data: prompt::Data) -> Result<prompt::Data, String> {
    db.prompt()
        .update(
            prompt::id::equals(data.id.clone()),
            vec![
                prompt::title::set(data.title),
                prompt::desc::set(data.desc),
                prompt::system::set(data.system),
                prompt::favorite::set(data.favorite),
                prompt::actived::set(data.actived),
                prompt::with_context::set(data.with_context),
                prompt::with_context_size::set(data.with_context_size),
                prompt::max_tokens::set(data.max_tokens),
                prompt::top_p::set(data.top_p),
                prompt::temperature::set(data.temperature),
                prompt::opts::set(data.opts),
                prompt::prehandle_script::set(data.prehandle_script),
                prompt::labels::set(data.labels),
                prompt::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string())
}


pub async fn delete_prompt(db: &PrismaClient, id: i32) -> Result<prompt::Data, String> {
    db.prompt()
        .delete(prompt::id::equals(id))
        .exec()
        .await
        .map_err(|e| e.to_string())
}