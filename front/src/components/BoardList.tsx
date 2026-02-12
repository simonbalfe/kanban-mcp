import { useState } from "react";
import { Board } from "../types";

interface Props {
  boards: Board[];
  selectedBoardId: string | null;
  onSelectBoard: (id: string) => void;
  onCreateBoard: (name: string) => void;
  onDeleteBoard: (id: string) => void;
}

export default function BoardList({
  boards,
  selectedBoardId,
  onSelectBoard,
  onCreateBoard,
  onDeleteBoard,
}: Props) {
  const [newBoardName, setNewBoardName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      await onCreateBoard(newBoardName);
      setNewBoardName("");
    }
  };

  return (
    <aside className="sidebar">
      <div className="boards-section">
        <h2>Boards</h2>
        <form onSubmit={handleCreate} className="create-board-form">
          <input
            type="text"
            placeholder="New board name..."
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="board-input"
          />
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
        <ul className="board-list">
          {boards.map((board) => (
            <li key={board._id} className={`board-item ${selectedBoardId === board._id ? "active" : ""}`}>
              <button
                onClick={() => onSelectBoard(board._id)}
                className="board-name-btn"
              >
                {board.name}
              </button>
              <button
                onClick={() => onDeleteBoard(board._id)}
                className="btn-delete"
                title="Delete board"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
