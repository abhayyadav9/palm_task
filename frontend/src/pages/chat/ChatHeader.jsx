const ChatHeader = ({ selectedUser, isOnline = false, onBack }) => {
  const getAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=2563eb&color=fff&size=128&bold=true`;
  };

  return (
    <div className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden -ml-1 p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Back to conversations"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative shrink-0">
          <img
            src={getAvatar(selectedUser?.name)}
            alt={selectedUser?.name}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
          />
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
              isOnline ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-slate-900 truncate">
            {selectedUser?.name}
          </h2>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span className="text-xs text-slate-500">
              {isOnline ? "Online now" : "Offline"}
              {selectedUser?.email ? ` • ${selectedUser.email}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          Active Conversation
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;