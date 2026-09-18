import fs from 'fs';
import path from 'path';
import pg from 'pg';

export interface DBOutfitState {
  costumeId: string;
  outerColorId: string;
  innerColorId: string;
  bottomColorId: string;
  bottomType: string;
  selectedAccessoryIds: string[];
  userPhotoUrl?: string;
  processedPhotoUrl?: string;
}

export interface DBCulturalScore {
  totalScore: number;
  grade: string;
  fiveElementsHarmony: string;
  feedback: string[];
}

export interface SavedLookbookRecord {
  id: string;
  title: string;
  createdAt: string;
  outfit: DBOutfitState;
  score: DBCulturalScore;
  aiNote?: string;
  thumbnailUrl?: string;
}

export interface ChatMessageRecord {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  text: string;
  actionPayload?: any;
  createdAt: number;
}

interface DatabaseAdapter {
  init(): Promise<void>;
  getLookbooks(): Promise<SavedLookbookRecord[]>;
  saveLookbook(item: SavedLookbookRecord): Promise<SavedLookbookRecord>;
  deleteLookbook(id: string): Promise<boolean>;
  saveChatMessage(msg: ChatMessageRecord): Promise<void>;
  getChatMessages(sessionId: string): Promise<ChatMessageRecord[]>;
  getEngineName(): string;
}

// -------------------------------------------------------------
// 1. PostgreSQL Engine (Dành cho Microsoft Azure PostgreSQL)
// -------------------------------------------------------------
class PostgresAdapter implements DatabaseAdapter {
  private pool: pg.Pool;

  constructor(connectionString: string) {
    this.pool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }

  getEngineName() {
    return 'PostgreSQL (Azure / Cloud)';
  }

  async init() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS lookbooks (
          id VARCHAR(64) PRIMARY KEY,
          title TEXT NOT NULL,
          created_at TEXT NOT NULL,
          outfit_data TEXT NOT NULL,
          score_data TEXT NOT NULL,
          ai_note TEXT,
          thumbnail_url TEXT
        );

        CREATE TABLE IF NOT EXISTS chat_sessions (
          id VARCHAR(64) PRIMARY KEY,
          title TEXT NOT NULL,
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(64) PRIMARY KEY,
          session_id VARCHAR(64) NOT NULL,
          sender VARCHAR(16) NOT NULL,
          text TEXT NOT NULL,
          action_payload TEXT,
          created_at BIGINT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
      `);
      console.log('✅ PostgreSQL Database initialized successfully on Azure/Cloud');
    } finally {
      client.release();
    }
  }

  async getLookbooks(): Promise<SavedLookbookRecord[]> {
    const res = await this.pool.query('SELECT * FROM lookbooks ORDER BY created_at DESC');
    return res.rows.map(r => ({
      id: r.id,
      title: r.title,
      createdAt: r.created_at,
      outfit: JSON.parse(r.outfit_data),
      score: JSON.parse(r.score_data),
      aiNote: r.ai_note || undefined,
      thumbnailUrl: r.thumbnail_url || undefined
    }));
  }

  async saveLookbook(item: SavedLookbookRecord): Promise<SavedLookbookRecord> {
    await this.pool.query(
      `INSERT INTO lookbooks (id, title, created_at, outfit_data, score_data, ai_note, thumbnail_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         outfit_data = EXCLUDED.outfit_data,
         score_data = EXCLUDED.score_data,
         ai_note = EXCLUDED.ai_note,
         thumbnail_url = EXCLUDED.thumbnail_url`,
      [
        item.id,
        item.title,
        item.createdAt,
        JSON.stringify(item.outfit),
        JSON.stringify(item.score),
        item.aiNote || null,
        item.thumbnailUrl || null
      ]
    );
    return item;
  }

  async deleteLookbook(id: string): Promise<boolean> {
    const res = await this.pool.query('DELETE FROM lookbooks WHERE id = $1', [id]);
    return (res.rowCount || 0) > 0;
  }

  async saveChatMessage(msg: ChatMessageRecord): Promise<void> {
    // Đảm bảo session tồn tại
    await this.pool.query(
      `INSERT INTO chat_sessions (id, title, created_at, updated_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET updated_at = EXCLUDED.updated_at`,
      [msg.sessionId, 'Phiên tư vấn ' + new Date().toLocaleDateString('vi-VN'), msg.createdAt, msg.createdAt]
    );

    await this.pool.query(
      `INSERT INTO chat_messages (id, session_id, sender, text, action_payload, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [
        msg.id,
        msg.sessionId,
        msg.sender,
        msg.text,
        msg.actionPayload ? JSON.stringify(msg.actionPayload) : null,
        msg.createdAt
      ]
    );
  }

  async getChatMessages(sessionId: string): Promise<ChatMessageRecord[]> {
    const res = await this.pool.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    return res.rows.map(r => ({
      id: r.id,
      sessionId: r.session_id,
      sender: r.sender,
      text: r.text,
      actionPayload: r.action_payload ? JSON.parse(r.action_payload) : undefined,
      createdAt: Number(r.created_at)
    }));
  }
}

// -------------------------------------------------------------
// 2. SQLite Engine (Dành cho Local Dev & Docker Zero-Config)
// -------------------------------------------------------------
class SQLiteAdapter implements DatabaseAdapter {
  private db: any;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  getEngineName() {
    return `SQLite (Local / Docker) [${this.dbPath}]`;
  }

  async init() {
    // Sử dụng module node:sqlite tích hợp sẵn trong Node.js 22
    const { DatabaseSync } = await import('node:sqlite');
    this.db = new DatabaseSync(this.dbPath);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS lookbooks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at TEXT NOT NULL,
        outfit_data TEXT NOT NULL,
        score_data TEXT NOT NULL,
        ai_note TEXT,
        thumbnail_url TEXT
      );

      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        action_payload TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
    `);
    console.log(`✅ SQLite Database initialized at ${this.dbPath}`);
  }

  async getLookbooks(): Promise<SavedLookbookRecord[]> {
    const stmt = this.db.prepare('SELECT * FROM lookbooks ORDER BY created_at DESC');
    const rows = stmt.all();
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      createdAt: r.created_at,
      outfit: JSON.parse(r.outfit_data),
      score: JSON.parse(r.score_data),
      aiNote: r.ai_note || undefined,
      thumbnailUrl: r.thumbnail_url || undefined
    }));
  }

  async saveLookbook(item: SavedLookbookRecord): Promise<SavedLookbookRecord> {
    const stmt = this.db.prepare(`
      INSERT INTO lookbooks (id, title, created_at, outfit_data, score_data, ai_note, thumbnail_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        outfit_data = excluded.outfit_data,
        score_data = excluded.score_data,
        ai_note = excluded.ai_note,
        thumbnail_url = excluded.thumbnail_url
    `);

    stmt.run(
      item.id,
      item.title,
      item.createdAt,
      JSON.stringify(item.outfit),
      JSON.stringify(item.score),
      item.aiNote || null,
      item.thumbnailUrl || null
    );
    return item;
  }

  async deleteLookbook(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM lookbooks WHERE id = ?');
    const result = stmt.run(id);
    return (result.changes || 0) > 0;
  }

  async saveChatMessage(msg: ChatMessageRecord): Promise<void> {
    const sessionStmt = this.db.prepare(`
      INSERT INTO chat_sessions (id, title, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at
    `);
    sessionStmt.run(
      msg.sessionId,
      'Phiên tư vấn ' + new Date().toLocaleDateString('vi-VN'),
      msg.createdAt,
      msg.createdAt
    );

    const msgStmt = this.db.prepare(`
      INSERT INTO chat_messages (id, session_id, sender, text, action_payload, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO NOTHING
    `);
    msgStmt.run(
      msg.id,
      msg.sessionId,
      msg.sender,
      msg.text,
      msg.actionPayload ? JSON.stringify(msg.actionPayload) : null,
      msg.createdAt
    );
  }

  async getChatMessages(sessionId: string): Promise<ChatMessageRecord[]> {
    const stmt = this.db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC');
    const rows = stmt.all(sessionId);
    return rows.map((r: any) => ({
      id: r.id,
      sessionId: r.session_id,
      sender: r.sender,
      text: r.text,
      actionPayload: r.action_payload ? JSON.parse(r.action_payload) : undefined,
      createdAt: Number(r.created_at)
    }));
  }
}

// -------------------------------------------------------------
// 3. Factory khởi tạo Dual Database
// -------------------------------------------------------------
export function createDatabaseAdapter(): DatabaseAdapter {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
    console.log('🔄 Detected DATABASE_URL, connecting to PostgreSQL (Azure Flexible Server)...');
    return new PostgresAdapter(databaseUrl);
  }

  const defaultPath = path.resolve(process.cwd(), process.env.DATABASE_PATH || './data/viet_costume.db');
  console.log('🔄 Using built-in SQLite database at:', defaultPath);
  return new SQLiteAdapter(defaultPath);
}

export const db = createDatabaseAdapter();
