import { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { Note } from '../types/Note';
import './NoteEditor.css';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  const debouncedUpdate = useCallback(
    (updates: Partial<Note>) => {
      const timeoutId = setTimeout(() => {
        onUpdateNote(note.id, updates);
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    [note.id, onUpdateNote]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedUpdate({ title: newTitle });
  };

  const handleContentChange = (value?: string) => {
    if (value !== undefined) {
      setContent(value);
      debouncedUpdate({ content: value });
    }
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        className="note-title-input"
        value={title}
        onChange={handleTitleChange}
        placeholder="Note title"
      />
      <div className="markdown-editor">
        <MDEditor
          value={content}
          onChange={handleContentChange}
          preview="edit"
          height={500}
        />
      </div>
      <div className="markdown-preview">
        <MDEditor.Markdown source={content} />
      </div>
    </div>
  );
}

export default NoteEditor; 