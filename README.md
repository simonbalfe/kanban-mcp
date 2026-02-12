# Kanban MCP

A full-stack kanban board application with Model Context Protocol (MCP) integration.

## Features

- **React Frontend**: Modern UI built with React, TypeScript, and Vite
- **Hono Backend**: Lightweight REST API with Hono framework
- **SQLite Database**: Persistent storage with better-sqlite3
- **MCP Integration**: Kanban board accessible via Model Context Protocol
- **Drag & Drop**: Intuitive card management
- **Multiple Boards**: Create and manage multiple kanban boards

## Project Structure

```
kanban-mcp/
├── front/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── mcp.ts
│   │   └── types.ts
│   └── package.json
├── back/           # Hono backend
│   ├── src/
│   │   ├── index.ts
│   │   └── db.ts
│   └── package.json
└── package.json    # Root workspace config
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime installed

### Installation

1. Clone the repository:
```bash
git clone https://github.com/simonbalfe/kanban-mcp.git
cd kanban-mcp
```

2. Install dependencies:
```bash
bun install
```

### Running the Application

Start both frontend and backend:

```bash
# In one terminal - Backend (port 3000)
cd back
bun run dev

# In another terminal - Frontend (port 5173)
cd front
bun run dev
```

Access the application at `http://localhost:5173`

## API Endpoints

### Boards
- `GET /boards` - List all boards
- `POST /boards` - Create a new board
- `GET /boards/:id` - Get a specific board
- `PUT /boards/:id` - Update a board
- `DELETE /boards/:id` - Delete a board

### Columns
- `POST /boards/:boardId/columns` - Create a column
- `PUT /columns/:id` - Update a column
- `DELETE /columns/:id` - Delete a column
- `PUT /columns/:id/position` - Update column position

### Cards
- `POST /columns/:columnId/cards` - Create a card
- `PUT /cards/:id` - Update a card
- `DELETE /cards/:id` - Delete a card
- `PUT /cards/:id/move` - Move a card between columns

## MCP Integration

The backend exposes MCP tools for programmatic board management. See `back/src/index.ts` for available MCP tools.

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- CSS3

**Backend:**
- Hono
- better-sqlite3
- TypeScript
- Bun runtime

## License

MIT
