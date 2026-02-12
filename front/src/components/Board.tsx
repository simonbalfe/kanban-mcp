import { useState } from "react";
import { Board as BoardType, Card as CardType } from "../types";
import { mcp } from "../mcp";
import Column from "./Column";

interface Props {
  board: BoardType & { cards: CardType[] };
  onRefresh: () => void;
}

const statuses = ["todo", "in-progress", "done"] as const;

export default function Board({ board, onRefresh }: Props) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardStatus, setNewCardStatus] = useState<typeof statuses[number]>("todo");

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      await mcp.createCard({
        boardId: board._id,
        title: newCardTitle,
        status: newCardStatus,
      });
      setNewCardTitle("");
      onRefresh();
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await mcp.deleteCard(cardId);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const handleUpdateCard = async (cardId: string, updates: Partial<CardType>) => {
    try {
      await mcp.updateCard({ cardId, ...updates });
      onRefresh();
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  };

  return (
    <main className="board">
      <div className="board-header">
        <h2>{board.name}</h2>
        <form onSubmit={handleCreateCard} className="create-card-form">
          <input
            type="text"
            placeholder="Add a card..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="card-input"
          />
          <select
            value={newCardStatus}
            onChange={(e) => setNewCardStatus(e.target.value as typeof statuses[number])}
            className="status-select"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
      <div className="columns">
        {statuses.map((status) => (
          <Column
            key={status}
            title={status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            cards={board.cards.filter((card) => card.status === status)}
            onDeleteCard={handleDeleteCard}
            onUpdateCard={handleUpdateCard}
          />
        ))}
      </div>
    </main>
  );
}
