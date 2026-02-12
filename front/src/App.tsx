import { useState, useEffect } from "react";
import { Board as BoardType, Card as CardType } from "./types";
import { mcp } from "./mcp";
import BoardList from "./components/BoardList";
import Board from "./components/Board";

export default function App() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<BoardType & { cards: CardType[] } | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoardId) {
      fetchBoard(selectedBoardId);
    }
  }, [selectedBoardId]);

  const fetchBoards = async () => {
    try {
      const data = await mcp.listBoards() as BoardType[];
      setBoards(data);
      if (data.length > 0 && !selectedBoardId) {
        setSelectedBoardId(data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch boards:", error);
    }
  };

  const fetchBoard = async (boardId: string) => {
    try {
      const data = await mcp.getBoard(boardId) as BoardType & { cards: CardType[] };
      setSelectedBoard(data);
    } catch (error) {
      console.error("Failed to fetch board:", error);
    }
  };

  const handleCreateBoard = async (name: string) => {
    try {
      const newBoard = await mcp.createBoard(name) as BoardType;
      setBoards([...boards, newBoard]);
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await mcp.deleteBoard(boardId);
      setBoards(boards.filter((b) => b._id !== boardId));
      if (selectedBoardId === boardId) {
        setSelectedBoardId(null);
      }
    } catch (error) {
      console.error("Failed to delete board:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Kanban</h1>
      </header>
      <div className="container">
        <BoardList
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
          onCreateBoard={handleCreateBoard}
          onDeleteBoard={handleDeleteBoard}
        />
        {selectedBoard && (
          <Board board={selectedBoard} onRefresh={() => selectedBoardId && fetchBoard(selectedBoardId)} />
        )}
      </div>
    </div>
  );
}
