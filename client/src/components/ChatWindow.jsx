import { useEffect, useRef } from 'react';
import { format } from 'date-fns';

export default function ChatWindow({ messages }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-2">
      {messages.map((m) =>
        m.system ? (
          <p key={m.id} className="text-center text-gray-500 text-sm">
            — {m.message} —
          </p>
        ) : (
          <div key={m.id}>
            <strong>{m.sender}</strong>{' '}
            <span className="text-xs text-gray-500">
              {format(new Date(m.timestamp), 'HH:mm')}
            </span>
            <p>{m.message}</p>
          </div>
        )
      )}
      <div ref={bottomRef} />
    </main>
  );
}