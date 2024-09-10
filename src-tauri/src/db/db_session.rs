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

pub async fn new_session(
    db: &PrismaClient,
    title: String,
    role_id: i32,
) -> Result<session::Data, String> {
    let result = db
        .session()
        .create(
            title,
            role_id,
            "text".to_string(),
            vec![
                session::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
                session::created_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string());
    return result;
}

pub async fn update_session(
    db: &PrismaClient,
    id: String,
    title: String,
    role_id: i32,
) -> Result<session::Data, String> {
    return db
        .session()
        .update(
            session::id::equals(id),
            vec![
                session::title::set(title),
                session::role_id::set(role_id),
                session::updated_at::set(chrono::DateTime::from(chrono::Utc::now())),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string());
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
    return result;
}

pub async fn save_session_data(
    db: &PrismaClient,
    _session_id: String,
    data: session_data::Data,
) -> Result<(), String> {
    return db
        .session_data()
        .create(
            data.session_id,
            data.role,
            data.message,
            data.is_ask,
            data.is_memory,
            data.message_type,
            data.model,
            vec![session_data::updated_at::set(chrono::DateTime::from(
                chrono::Utc::now(),
            ))],
        )
        .exec()
        .await
        .map(|_| ())
        .map_err(|e| e.to_string());
}

pub async fn update_session_data(
    db: &PrismaClient,
    data: session_data::Data,
) -> Result<(), String> {
    return db
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
        .map(|_| ())
        .map_err(|e| e.to_string());
}
