const MAX_HISTORY = 100;

function createBrokerState() {
  return {
    listeners: new Set(),
    history: [],
  };
}

function getBrokerState() {
  if (!global.__notificationBroker) {
    global.__notificationBroker = createBrokerState();
  }

  return global.__notificationBroker;
}

function buildNotification(input) {
  if (typeof input === "string") {
    return {
      id: crypto.randomUUID(),
      message: input,
      type: "info",
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: crypto.randomUUID(),
    message: input.message,
    type: input.type || "info",
    data: input.data,
    createdAt: new Date().toISOString(),
  };
}

export function publishNotification(input) {
  const broker = getBrokerState();
  const notification = buildNotification(input);

  broker.history.unshift(notification);
  if (broker.history.length > MAX_HISTORY) {
    broker.history.length = MAX_HISTORY;
  }

  for (const listener of broker.listeners) {
    listener(notification);
  }

  return notification;
}

export function subscribeNotifications(listener) {
  const broker = getBrokerState();
  broker.listeners.add(listener);

  return () => {
    broker.listeners.delete(listener);
  };
}

export function getRecentNotifications(limit = 20) {
  const broker = getBrokerState();
  return broker.history.slice(0, limit);
}
