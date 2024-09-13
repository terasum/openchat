use crate::db::prisma_client::session;
use crate::db::prisma_client::session_data;
use crate::db::prisma_client::PrismaClient;
use prisma_client_rust::chrono;
use prisma_client_rust::Direction;

pub async fn get_session_list(
    db: &PrismaClient,
    offset: i64,
    size: i64,
) -> Result<Vec<session::Data>, String> {
    db
        .session()
        .find_many(vec![])
        .skip(offset)
        .take(size)
        .order_by(session::updated_at::order(Direction::Asc))
        .exec()
        .await
        .map_err(|e| e.to_string())
}

pub async fn new_session(db: &PrismaClient, data: session::Data) -> Result<session::Data, String> {
    let result = db
        .session()
        .create(
            data.title,
            data.prompt_id,
            data.with_context,
            data.with_context_size,
            data.session_model,
            vec![
                session::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
                session::created_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string());
    result
}

pub async fn update_session(
    db: &PrismaClient,
    data: session::Data,
) -> Result<session::Data, String> {
    db
        .session()
        .update(
            session::id::equals(data.id),
            vec![
                session::title::set(data.title),
                session::prompt_id::set(data.prompt_id),
                session::with_context::set(data.with_context),
                session::with_context_size::set(data.with_context_size),
                session::session_model::set(data.session_model),
                session::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string())
}

pub async fn delete_session(db: &PrismaClient, id: String) -> Result<session::Data, String> {
    let result = db
        ._transaction()
        .run(|client| async move {
            let result1 = client
                .session_data()
                .delete_many(vec![session_data::session_id::equals(id.clone())])
                .exec()
                .await;

            match result1 {
                Ok(_) => {}
                Err(e) => {
                    return Err(e);
                }
            }

            let result = client
                .session()
                .delete(session::id::equals(id.clone()))
                .exec()
                .await;

            return result;
        })
        .await
        .map_err(|e| e.to_string());

    return result;
}

pub async fn get_session_data_by_id(
    db: &PrismaClient,
    id: String,
) -> Result<Vec<session_data::Data>, String> {
    let result = db
        .session_data()
        .find_many(vec![session_data::session_id::equals(id)])
        .order_by(session_data::id::order(Direction::Asc))
        .exec()
        .await
        .map_err(|e| e.to_string());
    result
}

pub async fn save_session_data(
    db: &PrismaClient,
    _session_id: String,
    data: session_data::Data,
) -> Result<session_data::Data, String> {
    db
        .session_data()
        .create(
            data.session_id,
            data.role,
            data.message,
            data.message_type,
            vec![
                session_data::updated_at::set(data.updated_at),
                session_data::created_at::set(data.created_at),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string())
}

pub async fn update_session_data(
    db: &PrismaClient,
    data: session_data::Data,
) -> Result<session_data::Data, String> {
    db
        .session_data()
        .update(
            session_data::id::equals(data.id),
            vec![
                session_data::message::set(data.message),
                session_data::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string())
}
