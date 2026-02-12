import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { connectDB, Board, Card } from "./db";

await connectDB();
console.log("✅ Database connected");

const server = new McpServer({
  name: "kanban",
  version: "1.0.50",
});

console.log("🔧 Registering MCP tools...");

server.registerTool(
  "list_boards",
  {
    description: "List all boards",
    inputSchema: {},
  },
  async () => {
    console.log("📋 [list_boards] Fetching all boards");
    try {
      const boards = await Board.find().sort({ createdAt: -1 });
      console.log(`✅ [list_boards] Found ${boards.length} boards`);
      return { content: [{ type: "text", text: JSON.stringify(boards, null, 2) }] };
    } catch (error) {
      console.error("❌ [list_boards] Error:", error);
      throw error;
    }
  }
);

server.registerTool(
  "create_board",
  {
    description: "Create a new board",
    inputSchema: { name: z.string().describe("Board name") },
  },
  async ({ name }) => {
    console.log(`➕ [create_board] Creating board: "${name}"`);
    try {
      const board = await Board.create({ name });
      console.log(`✅ [create_board] Board created with ID: ${board._id}`);
      return { content: [{ type: "text", text: JSON.stringify(board, null, 2) }] };
    } catch (error) {
      console.error("❌ [create_board] Error:", error);
      throw error;
    }
  }
);

server.registerTool(
  "get_board",
  {
    description: "Get a board with all its cards",
    inputSchema: { boardId: z.string().describe("Board ID") },
  },
  async ({ boardId }) => {
    console.log(`🔍 [get_board] Fetching board: ${boardId}`);
    try {
      const board = await Board.findById(boardId);
      if (!board) {
        console.log(`⚠️  [get_board] Board not found: ${boardId}`);
        return { content: [{ type: "text", text: "Board not found" }], isError: true };
      }
      const cards = await Card.find({ boardId }).sort({ order: 1, createdAt: -1 });
      console.log(`✅ [get_board] Found board with ${cards.length} cards`);
      return {
        content: [{ type: "text", text: JSON.stringify({ ...board.toObject(), cards }, null, 2) }],
      };
    } catch (error) {
      console.error("❌ [get_board] Error:", error);
      throw error;
    }
  }
);

server.registerTool(
  "delete_board",
  {
    description: "Delete a board and all its cards",
    inputSchema: { boardId: z.string().describe("Board ID") },
  },
  async ({ boardId }) => {
    console.log(`🗑️  [delete_board] Deleting board: ${boardId}`);
    try {
      const board = await Board.findByIdAndDelete(boardId);
      if (!board) {
        console.log(`⚠️  [delete_board] Board not found: ${boardId}`);
        return { content: [{ type: "text", text: "Board not found" }], isError: true };
      }
      const result = await Card.deleteMany({ boardId });
      console.log(`✅ [delete_board] Deleted board "${board.name}" and ${result.deletedCount} cards`);
      return { content: [{ type: "text", text: `Deleted board "${board.name}" and its cards` }] };
    } catch (error) {
      console.error("❌ [delete_board] Error:", error);
      throw error;
    }
  }
);

server.registerTool(
  "create_card",
  {
    description: "Create a new card on a board",
    inputSchema: {
      boardId: z.string().describe("Board ID"),
      title: z.string().describe("Card title"),
      description: z.string().optional().describe("Card description"),
      status: z.enum(["todo", "in-progress", "done"]).optional().describe("Card status"),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional().describe("Card priority"),
      order: z.number().optional().describe("Sort order"),
    },
  },
  async ({ boardId, title, ...rest }) => {
    console.log(`➕ [create_card] Creating card "${title}" on board ${boardId}`);
    try {
      const board = await Board.findById(boardId);
      if (!board) {
        console.log(`⚠️  [create_card] Board not found: ${boardId}`);
        return { content: [{ type: "text", text: "Board not found" }], isError: true };
      }
      const card = await Card.create({ boardId, title, ...rest });
      console.log(`✅ [create_card] Card created with ID: ${card._id}`);
      return { content: [{ type: "text", text: JSON.stringify(card, null, 2) }] };
    } catch (error) {
      console.error("❌ [create_card] Error:", error);
      throw error;
    }
  }
);

server.registerTool(
  "update_card",
  {
    description: "Update a card's fields",
    inputSchema: {
      cardId: z.string().describe("Card ID"),
      title: z.string().optional().describe("New title"),
      description: z.string().optional().describe("New description"),
      status: z.enum(["todo", "in-progress", "done"]).optional().describe("New status"),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional().describe("New priority"),
      order: z.number().optional().describe("New sort order"),
    },
  },
  async ({ cardId, ...updates }) => {
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    const updateKeys = Object.keys(filtered).join(", ");
    console.log(`✏️  [update_card] Updating card ${cardId} - fields: ${updateKeys}`);
    try {
      const card = await Card.findByIdAndUpdate(cardId, filtered, {
        new: true,
        runValidators: true,
      });
      if (!card) {
        console.log(`⚠️  [update_card] Card not found: ${cardId}`);
        return { content: [{ type: "text", text: "Card not found" }], isError: true };
      }
      console.log(`✅ [update_card] Card updated: ${card.title}`);
      return { content: [{ type: "text", text: JSON.stringify(card, null, 2) }] };
    } catch (error) {
      console.error("❌ [update_card] Error:", error);
      throw error;
    }
  }
);

server.registerTool(
  "delete_card",
  {
    description: "Delete a card",
    inputSchema: { cardId: z.string().describe("Card ID") },
  },
  async ({ cardId }) => {
    console.log(`🗑️  [delete_card] Deleting card: ${cardId}`);
    try {
      const card = await Card.findByIdAndDelete(cardId);
      if (!card) {
        console.log(`⚠️  [delete_card] Card not found: ${cardId}`);
        return { content: [{ type: "text", text: "Card not found" }], isError: true };
      }
      console.log(`✅ [delete_card] Card deleted: "${card.title}"`);
      return { content: [{ type: "text", text: `Deleted card "${card.title}"` }] };
    } catch (error) {
      console.error("❌ [delete_card] Error:", error);
      throw error;
    }
  }
);

console.log("✅ All MCP tools registered");

const PORT = Number(process.env.PORT) || 3001;

Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const timestamp = new Date().toISOString();

    if (url.pathname === "/mcp") {
      console.log(`\n🌐 [${timestamp}] ${req.method} ${url.pathname}`);
      try {
        const transport = new WebStandardStreamableHTTPServerTransport({
          sessionIdGenerator: () => crypto.randomUUID(),
        });
        await server.connect(transport);
        const response = await transport.handleRequest(req);
        console.log(`✅ [${timestamp}] Request completed successfully`);
        return response;
      } catch (error) {
        console.error(`❌ [${timestamp}] Request failed:`, error);
        throw error;
      }
    }

    console.log(`⚠️  [${timestamp}] ${req.method} ${url.pathname} - Not found`);
    return new Response("Not found", { status: 404 });
  },
});

console.log(`\n🚀 Kanban MCP server running on http://localhost:${PORT}/mcp`);
console.log("📡 Waiting for connections...\n");
