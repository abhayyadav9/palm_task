import React from "react";



const Message = ({ message, isMine }) => {
  const formatDateTime = (date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <div
      className={`flex mb-3 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[min(75%,32rem)] break-words whitespace-pre-wrap px-4 py-2 rounded-lg ${
          isMine
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800 border"
        }`}
      >
        <p>{message.message}</p>

        <p
          className={`text-xs mt-1 ${
            isMine ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {formatDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default Message;