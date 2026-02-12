import { Card as CardType } from "../types";

interface Props {
  card: CardType;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CardType>) => void;
}

export default function Card({ card, onDelete, onUpdate }: Props) {
  const priorityColor: Record<string, string> = {
    urgent: "#ff4444",
    high: "#ff8800",
    medium: "#ffbb00",
    low: "#88cc00",
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{card.title}</h4>
        <button
          onClick={() => onDelete(card._id)}
          className="btn-delete-card"
          title="Delete card"
        >
          ×
        </button>
      </div>
      {card.description && <p className="card-description">{card.description}</p>}
      {card.priority && (
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColor[card.priority] || "#999" }}
        >
          {card.priority}
        </span>
      )}
    </div>
  );
}
