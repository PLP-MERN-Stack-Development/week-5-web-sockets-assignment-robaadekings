export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return null;
  return (
    <div className="px-4 py-1 text-xs text-gray-500">
      {typingUsers.join(', ')} typing...
    </div>
  );
}