export interface Board {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  boardId: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  order?: number;
  createdAt: string;
  updatedAt: string;
}
