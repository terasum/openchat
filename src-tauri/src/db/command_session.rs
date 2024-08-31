use crate::db::prisma_client::session;
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
