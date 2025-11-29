import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import * as path from 'path';
import * as fs from 'fs';

export interface DatabaseConfig {
  path: string;
  wal?: boolean;
}

export class SQLiteConnector<T> {
  public db: Kysely<T>;
  private sqlite: Database.Database;

  constructor(config: DatabaseConfig) {
    // Ensure directory exists
    const dir = path.dirname(config.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.sqlite = new Database(config.path);
    
    if (config.wal) {
      this.sqlite.pragma('journal_mode = WAL');
    }

    this.db = new Kysely<T>({
      dialect: new SqliteDialect({
        database: this.sqlite,
      }),
    });
  }

  close() {
    this.sqlite.close();
  }
}
