import type { Note } from '../types/Note';
import './NoteList.css';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

function NoteList({ notes, selectedNote, onSelectNote, onDeleteNote }: NoteListProps) {
  return (
    <div className="note-list">
      {notes.map(note => (
        <div
          key={note.id}
          className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
          onClick={() => onSelectNote(note)}
        >
          <div className="note-item-header">
            <h3 className="note-title">{note.title || 'Untitled'}</h3>
            <div className="note-actions">
              <span className={`sync-status ${note.syncStatus}`}>
                {note.syncStatus}
              </span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
              >
                ×
              </button>
            </div>
          </div>
          <p className="note-preview">
            {note.content.substring(0, 100)}
            {note.content.length > 100 ? '...' : ''}
          </p>
          <span className="note-date">
            {new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default NoteList; 