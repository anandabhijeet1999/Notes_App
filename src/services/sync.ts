import { v4 as uuidv4 } from 'uuid';
import type { Note } from '../types/Note';
import { db } from './db';
import { api } from './api';

class SyncService {
  private isOnline = navigator.onLine;
  private syncQueue: { type: 'create' | 'update' | 'delete'; note: Note }[] = [];

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.syncChanges();
  };

  private handleOffline = () => {
    this.isOnline = false;
  };

  async createNote(title: string, content: string): Promise<Note> {
    const note: Note = {
      id: uuidv4(),
      title,
      content,
      updatedAt: new Date().toISOString(),
      synced: false,
      syncStatus: 'unsynced',
    };

    await db.saveNote(note);
    if (this.isOnline) {
      try {
        note.syncStatus = 'syncing';
        await db.saveNote(note);
        const syncedNote = await api.createNote(note);
        syncedNote.syncStatus = 'synced';
        await db.saveNote(syncedNote);
      } catch (error) {
        note.syncStatus = 'error';
        await db.saveNote(note);
        this.syncQueue.push({ type: 'create', note });
      }
    } else {
      this.syncQueue.push({ type: 'create', note });
    }

    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const existingNote = await db.getNote(id);
    if (!existingNote) throw new Error('Note not found');

    const updatedNote = {
      ...existingNote,
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
      syncStatus: 'unsynced' as const,
    };

    await db.saveNote(updatedNote);
    if (this.isOnline) {
      try {
        updatedNote.syncStatus = 'syncing';
        await db.saveNote(updatedNote);
        const syncedNote = await api.updateNote(id, updatedNote);
        syncedNote.syncStatus = 'synced';
        await db.saveNote(syncedNote);
      } catch (error) {
        updatedNote.syncStatus = 'error';
        await db.saveNote(updatedNote);
        this.syncQueue.push({ type: 'update', note: updatedNote });
      }
    } else {
      this.syncQueue.push({ type: 'update', note: updatedNote });
    }

    return updatedNote;
  }

  async deleteNote(id: string): Promise<void> {
    const note = await db.getNote(id);
    if (!note) throw new Error('Note not found');

    await db.deleteNote(id);
    if (this.isOnline) {
      try {
        await api.deleteNote(id);
      } catch (error) {
        this.syncQueue.push({ type: 'delete', note });
      }
    } else {
      this.syncQueue.push({ type: 'delete', note });
    }
  }

  private async syncChanges() {
    while (this.syncQueue.length > 0 && this.isOnline) {
      const change = this.syncQueue[0];
      try {
        switch (change.type) {
          case 'create':
            await api.createNote(change.note);
            break;
          case 'update':
            await api.updateNote(change.note.id, change.note);
            break;
          case 'delete':
            await api.deleteNote(change.note.id);
            break;
        }
        this.syncQueue.shift();
      } catch (error) {
        console.error('Sync failed:', error);
        break;
      }
    }
  }
}

export const syncService = new SyncService(); 