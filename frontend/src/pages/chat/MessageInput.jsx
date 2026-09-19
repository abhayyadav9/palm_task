import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    onSend(message);

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="shrink-0 bg-white border-t p-3 md:p-4">
      <div className="flex min-w-0 gap-2 md:gap-3">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-w-0 flex-1 border rounded-lg px-3 md:px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          onClick={sendMessage}
          className="shrink-0 px-4 md:px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>

      </div>
    </div>
  );
};

export default MessageInput;