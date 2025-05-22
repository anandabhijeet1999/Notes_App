export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  synced: boolean;
  syncStatus?: 'synced' | 'syncing' | 'unsynced' | 'error';
} 