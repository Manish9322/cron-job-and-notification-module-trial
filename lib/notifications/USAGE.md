# Realtime Notification Utility

This module is framework-friendly and easy to move to other projects.

## Files

- `lib/notifications/broker.js`: in-memory pub/sub + bounded history.
- `app/api/notifications/route.js`: GET recent + POST publish.
- `app/api/notifications/stream/route.js`: SSE stream for realtime updates.

## API

- `GET /api/notifications` -> latest 20 notifications.
- `POST /api/notifications` with `{ "message": "...", "type": "info" }`.
- `GET /api/notifications/stream` -> EventSource stream.

## Minimal Client

```js
const source = new EventSource("/api/notifications/stream");

source.addEventListener("snapshot", (event) => {
  const items = JSON.parse(event.data);
  console.log("initial items", items);
});

source.addEventListener("notification", (event) => {
  const item = JSON.parse(event.data);
  console.log("new item", item);
});
```
