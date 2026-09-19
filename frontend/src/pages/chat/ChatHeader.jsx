import React from "react";

const ChatHeader = ({ selectedUser, onBack }) => {
  return (
    <div className="h-16 shrink-0 bg-white border-b flex items-center gap-3 px-4 md:px-5">
      <button
        type="button"
        onClick={onBack}
        className="md:hidden w-9 h-9 rounded-full hover:bg-gray-100 text-gray-600"
        aria-label="Back to conversations"
      >
        &larr;
      </button>

      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          selectedUser?.name || "User"
        )}&background=random&color=fff`}
        alt={selectedUser?.name}
        className="w-10 h-10 rounded-full"
      />

      <div className="min-w-0">
        <h2 className="font-semibold text-gray-800 truncate">
          {selectedUser?.name}
        </h2>

        <p className="text-xs text-green-500">
          Online
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;