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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="shrink-0 bg-white border-t border-slate-200 p-3 sm:p-4">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Press Enter to send)"
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl py-2.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500/15 transition-all"
          />
        </div>

        <button
          type="button"
          onClick={sendMessage}
          disabled={!message.trim()}
          className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-colors cursor-pointer"
          title="Send message"
        >
          <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;