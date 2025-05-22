# Markdown Notes App

A modern, offline-first notes application built with React and TypeScript. The app supports Markdown editing, offline persistence using IndexedDB, and automatic syncing when online.

## Features

- 📝 Create, edit, and delete notes with Markdown support
- 💾 Offline-first functionality with IndexedDB
- 🔄 Automatic syncing when online
- 🔍 Search notes by title or content
- 📱 Responsive and accessible UI
- 🎨 Modern and clean design

## Tech Stack

- React 18
- TypeScript
- IndexedDB (via idb)
- Markdown Editor (@uiw/react-md-editor)
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the mock API server (in a separate terminal):
```bash
npm run mock-api
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
  ├── components/         # React components
  │   ├── NoteEditor.tsx  # Markdown editor component
  │   └── NoteList.tsx    # Notes list component
  ├── services/          # Core services
  │   ├── api.ts         # API client
  │   ├── db.ts          # IndexedDB service
  │   └── sync.ts        # Sync service
  ├── types/             # TypeScript types
  │   └── Note.ts        # Note interface
  └── App.tsx            # Main app component
```

## Design Decisions

### Offline-First Architecture

The app uses IndexedDB for local storage and implements a queue-based sync system. When offline:
1. Changes are stored locally
2. Changes are queued for sync
3. When online, queued changes are processed in order

### Sync Strategy

- Client-wins strategy for conflict resolution
- Sync status indicators for each note
- Automatic retry on sync failure
- Queue-based sync to handle multiple changes

### Performance Considerations

- Debounced autosave (500ms)
- Efficient IndexedDB queries with indexes
- Lazy loading of note content
- Optimistic UI updates

## Limitations

- No user authentication
- No real-time collaboration
- Limited conflict resolution (client-wins only)
- No file attachments

## Future Improvements

- [ ] User authentication
- [ ] Real-time collaboration
- [ ] Advanced conflict resolution
- [ ] File attachments
- [ ] Tags and categories
- [ ] Export/import functionality
- [ ] PWA support
- [ ] Unit and integration tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd notes-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Start the mock API server:**
   ```bash
   npm run mock-api
   ```

## Design Decisions and Tradeoffs

- **Offline-First Approach:** The app uses IndexedDB for local storage, allowing users to work offline. This decision prioritizes user experience and reliability over immediate data consistency.
- **Conflict Resolution:** The app implements a simple conflict resolution strategy by syncing changes when the user comes back online. This approach may not handle complex conflicts but provides a balance between simplicity and functionality.
- **TypeScript:** The app is built with TypeScript to ensure type safety and improve developer experience. This adds some overhead but reduces runtime errors and improves maintainability.

## Assumptions and Limitations

- **Browser Support:** The app assumes modern browser support for IndexedDB and other web APIs. It may not work in older browsers.
- **Network Reliability:** The app assumes a relatively stable network connection for syncing. Poor network conditions may lead to sync failures.
- **Data Volume:** The app is designed for personal use and may not handle large volumes of data efficiently.

## Instructions on How to Run and Test the App

1. **Run the App:**
   - Start the development server with `npm run dev`.
   - Start the mock API server with `npm run mock-api`.
   - Open your browser and navigate to `http://localhost:5173`.

2. **Test the App:**
   - **Create a Note:** Click the "New Note" button and enter a title and content.
   - **Edit a Note:** Select a note from the list and modify its title or content.
   - **Delete a Note:** Click the delete button on a note to remove it.
   - **Offline Testing:** Disconnect from the network and perform actions. Reconnect to see if changes sync correctly.
