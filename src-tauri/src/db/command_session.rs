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
    return db
        .session()
        .find_many(vec![])
        .skip(offset)
        .take(size)
        .order_by(session::updated_at::order(Direction::Asc))
        .exec()
        .await
        .map_err(|e| e.to_string());
}

pub async fn get_session_data_by_id(
    db: &PrismaClient,
    id: String,
) -> Result<Vec<session_data::Data>, String> {
    let result =  db
        .session_data()
        .find_many(vec![session_data::session_id::equals(id)])
        .order_by(session_data::id::order(Direction::Asc))
        .exec()
        .await
        .map_err(|e| e.to_string());
    return result;
}

pub async fn save_session_data(db: &PrismaClient, session_id: String, data: session_data::Data) -> Result<(), String> {
    return db
        .session_data()
        .create(data.session_id,
            data.role,
            data.message,
            data.is_ask,
            data.is_memory,
            data.message_type,
            data.model,
            vec![
                session_data::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ]
        )
        .exec()
        .await
        .map(|_| ())
        .map_err(|e| e.to_string());
}

pub async fn update_session_data(db: &PrismaClient, data: session_data::Data) -> Result<(), String> {
    return db
        .session_data()
        .update(
            session_data::id::equals(data.id),
            vec![
                session_data::message::set(data.message),
                session_data::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ]
        )
        .exec()
        .await
        .map(|_| ())
        .map_err(|e| e.to_string());
}