import { Card as CardType } from "../types";
import Card from "./Card";

interface Props {
  title: string;
  cards: CardType[];
  onDeleteCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<CardType>) => void;
}

export default function Column({ title, cards, onDeleteCard, onUpdateCard }: Props) {
  return (
    <div className="column">
      <h3 className="column-title">
        {title}
        <span className="card-count">{cards.length}</span>
      </h3>
      <div className="cards-list">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onDelete={onDeleteCard}
            onUpdate={onUpdateCard}
          />
        ))}
      </div>
    </div>
  );
}
