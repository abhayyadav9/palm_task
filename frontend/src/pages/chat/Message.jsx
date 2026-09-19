import React from "react";

const Message = ({ message, isMine }) => {
  const formatDateTime = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const textContent = message.content || message.message || "";

  return (
    <div className={`flex w-full my-1 ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl shadow-xs transition-all ${
          isMine
            ? "bg-blue-600 text-white rounded-br-xs"
            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{textContent}</p>
        <div
          className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
            isMine ? "text-blue-200" : "text-slate-400"
          }`}
        >
          <span>{formatDateTime(message.createdAt)}</span>
          {isMine && (
            <svg className="w-3 h-3 text-blue-200 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
