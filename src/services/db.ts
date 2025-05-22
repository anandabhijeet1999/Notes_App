import { openDB, type IDBPDatabase } from 'idb';
import type { DBSchema } from 'idb';
import type { Note } from '../types/Note';

interface NotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-updatedAt': string };
  };
}

class DatabaseService {
  private db: IDBPDatabase<NotesDB> | null = null;
  private readonly DB_NAME = 'notes-app';
  private readonly DB_VERSION = 1;

  async init() {
    this.db = await openDB<NotesDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('notes', { keyPath: 'id' });
        store.createIndex('by-updatedAt', 'updatedAt');
      },
    });
  }

  async getAllNotes(): Promise<Note[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('notes', 'by-updatedAt');
  }

  async getNote(id: string): Promise<Note | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('notes', id);
  }

  async saveNote(note: Note): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('notes', note);
  }

  async deleteNote(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('notes', id);
  }
}

export const db = new DatabaseService(); 