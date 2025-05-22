import { useState, useEffect } from 'react';
import type { Note } from './types/Note';
import { db } from './services/db';
import { syncService } from './services/sync';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import './App.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadNotes = async () => {
      const loadedNotes = await db.getAllNotes();
      setNotes(loadedNotes);
    };
    loadNotes();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCreateNote = async () => {
    const newNote = await syncService.createNote('New Note', '');
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    const updatedNote = await syncService.updateNote(id, updates);
    setNotes(notes.map(note => note.id === id ? updatedNote : note));
    if (selectedNote?.id === id) {
      setSelectedNote(updatedNote);
    }
  };

  const handleDeleteNote = async (id: string) => {
    await syncService.deleteNote(id);
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Notes App</h1>
        <div className="status-bar">
          <span className={`status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </header>
      <div className="app-content">
        <aside className="sidebar">
          <button onClick={handleCreateNote} className="new-note-btn">
            New Note
          </button>
          <NoteList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
            onDeleteNote={handleDeleteNote}
          />
        </aside>
        <main className="editor">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdateNote={handleUpdateNote}
            />
          ) : (
            <div className="empty-state">
              Select a note or create a new one
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
