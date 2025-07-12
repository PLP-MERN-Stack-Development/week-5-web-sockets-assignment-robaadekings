import { useRef } from 'react';

export default function MessageInput({ onSend, onTyping }) {
  const inputRef = useRef();

  const send = () => {
    const val = inputRef.current.value.trim();
    if (!val) return;
    onSend(val);
    inputRef.current.value = '';
    onTyping(false);
  };

  return (
    <footer className="p-4 flex gap-2">
      <input
        ref={inputRef}
        className="flex-1 border rounded p-2"
        placeholder="Type a message"
        onChange={(e) => onTyping(e.target.value.length > 0)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
      />
      <button onClick={send} className="bg-blue-600 text-white px-4 rounded">
        Send
      </button>
    </footer>
  );
}