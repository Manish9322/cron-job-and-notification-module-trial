"use client";

import { useEffect, useState } from "react";
import {
  useCreateRandomStringMutation,
  useGetRandomStringsQuery,
} from "@/redux/api";

type RandomStringItem = {
  _id: string;
  value: string;
  source: "cron" | "manual";
  createdAt: string;
};

type NotificationItem = {
  id: string;
  message: string;
  type: string;
  createdAt: string;
};

export default function Home() {
  const { data, isLoading, isFetching, refetch, error } =
    useGetRandomStringsQuery(undefined);
  const [createRandomString, { isLoading: isCreating }] =
    useCreateRandomStringMutation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [noticeText, setNoticeText] = useState("Hello from realtime module");
  const [isSendingNotice, setIsSendingNotice] = useState(false);

  const rows: RandomStringItem[] = data?.data ?? [];

  useEffect(() => {
    const source = new EventSource("/api/notifications/stream");

    source.addEventListener("snapshot", (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data);
      setNotifications(payload);
    });

    source.addEventListener("notification", (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data);
      setNotifications((prev) => [payload, ...prev].slice(0, 20));
    });

    return () => {
      source.close();
    };
  }, []);

  async function sendNotification() {
    if (!noticeText.trim()) {
      return;
    }

    try {
      setIsSendingNotice(true);
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: noticeText.trim(),
          type: "info",
        }),
      });
      setNoticeText("");
    } finally {
      setIsSendingNotice(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Cron Job Random Strings</h1>
      <p className="mt-2 text-sm text-gray-600">
        Cron runs every minute and inserts a random string in MongoDB.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => createRandomString(undefined)}
          disabled={isCreating}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isCreating ? "Adding..." : "Add Manually"}
        </button>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded border border-gray-300 px-4 py-2 text-sm"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {(isLoading || (isFetching && rows.length === 0)) && (
        <p className="mt-6 text-sm">Loading values...</p>
      )}
      {error && (
        <p className="mt-6 text-sm text-red-600">
          Failed to fetch data. Check MongoDB connection.
        </p>
      )}

      {!isLoading && !isFetching && !error && rows.length === 0 && (
        <p className="mt-6 text-sm text-gray-600">No value to display.</p>
      )}

      <ul className="mt-6 space-y-2">
        {rows.map((item) => (
          <li
            key={item._id}
            className="rounded border border-gray-200 p-3 text-sm"
          >
            <p>
              <span className="font-medium">Value:</span> {item.value}
            </p>
            <p>
              <span className="font-medium">Source:</span> {item.source}
            </p>
            <p>
              <span className="font-medium">Created:</span>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <section className="mt-10 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold">Realtime Notifications</h2>
        <p className="mt-2 text-sm text-gray-600">
          Utility-based module using SSE. You can reuse this in other projects.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            value={noticeText}
            onChange={(event) => setNoticeText(event.target.value)}
            placeholder="Write a notification"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={sendNotification}
            disabled={isSendingNotice}
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSendingNotice ? "Sending..." : "Send"}
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {notifications.length === 0 && (
            <li className="text-sm text-gray-600">No notifications yet.</li>
          )}

          {notifications.map((item) => (
            <li key={item.id} className="rounded border border-gray-200 p-3 text-sm">
              <p>
                <span className="font-medium">Message:</span> {item.message}
              </p>
              <p>
                <span className="font-medium">Type:</span> {item.type}
              </p>
              <p>
                <span className="font-medium">Time:</span>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
