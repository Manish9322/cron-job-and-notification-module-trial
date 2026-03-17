import {
  getRecentNotifications,
  subscribeNotifications,
} from "@/lib/notifications/broker";

export const runtime = "nodejs";

function toSSE(event, data) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
  const encoder = new TextEncoder();
  let cleanup = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event, payload) => {
        controller.enqueue(encoder.encode(toSSE(event, payload)));
      };

      send("ready", { ok: true });
      send("snapshot", getRecentNotifications(20));

      const unsubscribe = subscribeNotifications((notification) => {
        send("notification", notification);
      });

      const heartbeat = setInterval(() => {
        send("ping", { ts: Date.now() });
      }, 25000);

      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
    },
    cancel() {
      if (cleanup) {
        cleanup();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
