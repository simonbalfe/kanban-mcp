const MCP_URL = "/mcp";

let requestId = 0;

async function callTool(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
  const id = ++requestId;

  const initRes = await fetch(MCP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: id,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "kanban-frontend", version: "1.0.0" },
      },
    }),
  });

  const sessionId = initRes.headers.get("mcp-session-id");
  const initData = await initRes.json();
  if (initData.error) throw new Error(initData.error.message);

  await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    }),
  });

  const toolId = ++requestId;
  const toolRes = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: toolId,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  const toolData = await toolRes.json();
  if (toolData.error) throw new Error(toolData.error.message);

  const content = toolData.result?.content;
  if (!content || content.length === 0) return null;

  const text = content[0]?.text;
  if (toolData.result?.isError) throw new Error(text);

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const mcp = {
  listBoards: () => callTool("list_boards"),
  createBoard: (name: string) => callTool("create_board", { name }),
  getBoard: (boardId: string) => callTool("get_board", { boardId }),
  deleteBoard: (boardId: string) => callTool("delete_board", { boardId }),
  createCard: (args: {
    boardId: string;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    order?: number;
  }) => callTool("create_card", args),
  updateCard: (args: { cardId: string } & Record<string, unknown>) =>
    callTool("update_card", args),
  deleteCard: (cardId: string) => callTool("delete_card", { cardId }),
};
