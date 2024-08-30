use std::path::PathBuf;

use rusqlite::{Connection, Result};

pub fn is_app_inited(path: &PathBuf) -> bool {
    println!(
        "rust internal database path: {}",
        path.clone().to_str().unwrap()
    );
    path.exists()
}

pub fn create_table(path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    let conn = Connection::open(path)?;

    let version: &str = env!("CARGO_PKG_VERSION");

    conn.execute(
        r#"
        CREATE TABLE IF NOT EXISTS session (id TEXT, title TEXT, role_id INTEGER, type TEXT DEFAULT 'text', update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        "#,
        (),
    )?;
    conn.execute(
        r#"
        CREATE TABLE IF NOT EXISTS session_data (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, message TEXT, is_ask INTEGER, is_memory INTEGER, message_type TEXT, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        "#,
        (),
    )?;

    conn.execute(
        r#"
        CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, is_default INTEGER DEFAULT false);
        "#,
        (),
    )?;

    conn.execute(
        r#"
        CREATE TABLE IF NOT EXISTS credit (id INTEGER PRIMARY KEY AUTOINCREMENT, history_id INTEGER, token_cost INTEGER, api_key TEXT);
        "#,
        (),
    )?;

    let sql = format!(
        r#"
        CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT, version TEXT DEFAULT '{}');
        "#,
        version
    );

    conn.execute(sql.as_str(), ())?;

    let _ = conn.close();
    Ok(())
}

pub fn insert_data(path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    let version: &str = env!("CARGO_PKG_VERSION");

    let conn = Connection::open(path)?;

    match conn.execute(
        r#"
        INSERT INTO role (id, name, description, system, is_default) VALUES (1, 'ChatGPT', '通用人工智能助理', '所有回答请使用Markdown格式回复', true);
        "#,
        (),
    ) {
        Ok(inserted) => println!("role initial data were inseted({})", inserted),
        Err(err) => println!("role initial data insert skip: {}", err),
    }

    // configs
    match conn.execute(
        r#"
             INSERT INTO config (id, key, value, version) VALUES (1, 'current_role_id', '1', '1');)
            "#,
        (),
    ) {
        Ok(inserted) => println!("config initial data were inseted({})", inserted),
        Err(err) => println!("config initial data insert skip: {}", err),
    }

    // configs
    match conn.execute(
        format!(
            r#"
        INSERT INTO config (id, key, value, version) VALUES (2, 'version', '{}', '{}')
        "#,
            version, version
        )
        .as_str(),
        (),
    ) {
        Ok(inserted) => println!("config initial data were inseted({})", inserted),
        Err(err) => println!("config initial data insert skip: {}", err),
    }

    conn.close();
    Ok(())
}

pub fn migrate_data(path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    let conn = Connection::open(path)?;
    let sql1 = "ALTER TABLE session_data ADD COLUMN model TEXT DEFAULT 'gpt-4o-mini';";

    match conn.execute(sql1, ()) {
        Ok(updated) => println!("session_data were updated({})", updated),
        Err(err) => println!("update skip: {}", err),
    }

    // 2024-07-30 在 role 表中添加 system 列, 代表默认的系统设定
    let sql2 = "ALTER TABLE role ADD COLUMN system TEXT DEFAULT '所有回答请使用Markdown格式回复';";
    match conn.execute(sql2, ()) {
        Ok(updated) => println!("role add system column success, ({})", updated),
        Err(err) => println!("update skip: {}", err),
    }

    // 2024-07-30 在 role 表中添加 category 列, 代表默认的系统设定
    let sql3 = "ALTER TABLE role ADD COLUMN category TEXT DEFAULT 'general';";
    match conn.execute(sql3, ()) {
        Ok(updated) => println!("role add category column success, ({})", updated),
        Err(err) => println!("update skip: {}", err),
    }

    conn.close();
    Ok(())
}

pub fn init_app(path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    println!("================= INIT APP ===============");
    if is_app_inited(path) {
        let _ = migrate_data(path);
        let _ = insert_data(path);
        return Ok(());
    } else {
        // 创建表
        let _ = create_table(path);
        // migrate
        let _ = migrate_data(path);
        let _ = insert_data(path);
    }

    Ok(())
}
