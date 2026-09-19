import React, { useEffect, useRef } from "react";
import Message from "./Message";

const MessageList = ({ messages, user, loading, error }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 flex flex-col">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">Loading conversation...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-sm text-center p-4 bg-red-50 border border-red-200/80 rounded-2xl text-red-600 text-sm">
            <svg className="w-6 h-6 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3.5 shadow-2xs">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 text-base">No messages yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Send a message below to start your real-time conversation.
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-1">
          {messages.map((message) => (
            <Message
              key={message._id || message.clientMessageId || message.id}
              message={message}
              isMine={String(message.sender?._id || message.sender) === String(user?._id)}
            />
          ))}
          <div ref={bottomRef} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default MessageList;
