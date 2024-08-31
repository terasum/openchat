use crate::db::prisma_client::session;
use crate::db::prisma_client::session_data;
use crate::db::prisma_client::PrismaClient;

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
        .exec()
        .await
        .map_err(|e| e.to_string());
    return result;
}
