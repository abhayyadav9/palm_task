import Message from "./Message";

const MessageList = ({ messages, user, loading, error }) => {
  return (
    <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-4 md:p-5 bg-gray-100">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">Loading messages...</p>
        </div>
      ) : error ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">
            No messages yet
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <Message
            key={message._id || message.id}
            message={message}
            isMine={String(message.sender) === String(user?._id)}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;