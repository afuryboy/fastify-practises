import { FastifyReply, FastifyRequest } from "fastify";

interface ChatMessage {
  message: string;
  createdAt: Date;
}

interface ChatEvent {
  type: "message" | "connection" | "error";
  message: ChatMessage;
}

// 设置 SSE 所需的响应头
const SSE_HEADERS = {
  "Content-type": "text/event-stream",
  Connection: "keep-alive",
  "Cache-control": "no-cache",
};

// 存储所有活动的 SSE 连接
const clients = new Set<FastifyReply>();

const setupConnection = (reply: FastifyReply) => {
  // 写入header
  reply.raw.writeHead(200, SSE_HEADERS);

  // 将客户端添加到连接池
  clients.add(reply);
};

const getDataString = (event: ChatEvent) => {
  return `data: ${JSON.stringify(event)}\n\n`;
};
const sendMessage = (reply: FastifyReply) => {
  const welcomeEvent: ChatEvent = {
    type: "connection",
    message: {
      message: "Connected successfully",
      createdAt: new Date(),
    },
  };
  reply.raw.write(getDataString(welcomeEvent));
};

const sendError = (reply: FastifyReply) => {
  const errorResponse: ChatEvent = {
    type: "error",
    message: {
      message: "Internal server error",
      createdAt: new Date(),
    },
  };
  reply.raw.writeHead(500, SSE_HEADERS);
  reply.raw.write(getDataString(errorResponse));
  reply.raw.end();
};

export const broadcastMessage = async (message: string) => {
  try {
    const chatEvent: ChatEvent = {
      type: "message",
      message: {
        message,
        createdAt: new Date(),
      },
    };
    clients.forEach((client) => {
      client.raw.write(getDataString(chatEvent));
    });
  } catch (error) {}
};

export const sseControl = async function (
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    setupConnection(reply);

    // 客户端断开连接时的清理工作
    request.raw.on("close", () => {
      clients.delete(reply);
      reply.raw.end();
      console.log("Client disconnected");
    });
    sendMessage(reply);
    console.log("Client connected successfully");
  } catch (error) {
    console.error("Error in SSE handler:", error);
    sendError(reply);
  }
};

export const sendSSEControl = async function (
  request: FastifyRequest<{Body: {message: string}}>,
  reply: FastifyReply
) {
  try {
    const {message} = request.body
    broadcastMessage(message)
    return reply.send({ success: true, message: 'Event sent' });
  } catch (error) {
    console.error("Error in SSE Send:", error);
    sendError(reply);
  }
};
