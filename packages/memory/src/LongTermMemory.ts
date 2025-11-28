import { SQLiteConnector } from '@operone/db';

export interface MemoryEntry {
  id: string;
  content: string;
  type: string;
  timestamp: number;
  metadata?: string;
}

export interface MemoryDatabase {
  memory: MemoryEntry;
}

export class LongTermMemory {
  private db: SQLiteConnector<MemoryDatabase>;

  constructor(dbPath: string) {
    this.db = new SQLiteConnector<MemoryDatabase>({
      path: dbPath,
      wal: true,
    });

    this.initialize();
  }

  private async initialize() {
    await this.db.db.schema
      .createTable('memory')
      .ifNotExists()
      .addColumn('id', 'text', (col) => col.primaryKey())
      .addColumn('content', 'text', (col) => col.notNull())
      .addColumn('type', 'text', (col) => col.notNull())
      .addColumn('timestamp', 'integer', (col) => col.notNull())
      .addColumn('metadata', 'text')
      .execute();
  }

  async store(entry: MemoryEntry): Promise<void> {
    await this.db.db
      .insertInto('memory')
      .values({
        ...entry,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
      })
      .execute();
  }

  async retrieve(id: string): Promise<MemoryEntry | undefined> {
    const result = await this.db.db
      .selectFrom('memory')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    
    return result;
  }

  async search(query: string): Promise<MemoryEntry[]> {
    // Basic text search for now
    return await this.db.db
      .selectFrom('memory')
      .selectAll()
      .where('content', 'like', `%${query}%`)
      .execute();
  }
}
