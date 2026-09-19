import { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import ChatHeader from "../chat/ChatHeader";
import MessageList from "../chat/MessageList";
import MessageInput from "../chat/MessageInput";
import { getMessagesApi } from "../../services/api";
import axios from "axios";
import socket from "../../services/socket";


const Home  = ({ user }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalMessages: 0, totalChats: 0 });

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    const joinUser = () => socket.emit("join_user", user._id);
    const handleOnlineUsers = (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };

    socket.on("connect", joinUser);
    socket.on("get_online_users", handleOnlineUsers);

    if (socket.connected) {
      joinUser();
    }

    return () => {
      socket.off("connect", joinUser);
      socket.off("get_online_users", handleOnlineUsers);
    };
  }, [user?._id]);


  useEffect(() => {
    if (!user?._id) return;

    const receiveMessage = (message) => {
      const senderId = String(message.sender?._id ?? message.sender);
      const receiverId = String(message.receiver?._id ?? message.receiver);
      const isCurrentConversation =
        selectedUser?._id &&
        ((senderId === String(user._id) && receiverId === String(selectedUser._id)) ||
          (senderId === String(selectedUser._id) && receiverId === String(user._id)));

      if (!isCurrentConversation) return;

      setMessages((prev) => {
        if (prev.some((currentMessage) => currentMessage._id === message._id)) {
          return prev;
        }

        const temporaryIndex = prev.findIndex(
          (currentMessage) => currentMessage.clientMessageId === message.clientMessageId,
        );
        const normalizedMessage = { ...message, message: message.content };

        if (temporaryIndex === -1) return [...prev, normalizedMessage];

        return prev.map((currentMessage, index) =>
          index === temporaryIndex ? normalizedMessage : currentMessage,
        );
      });
    };

    socket.on("receive_message", receiveMessage);
    return () => socket.off("receive_message", receiveMessage);
  }, [selectedUser?._id, user?._id]);

  useEffect(() => {
    if (!user?._id || !selectedUser?._id) {
      return;
    
    }

    let isCurrentRequest = true;

    const getMessages = async () => {
      setMessagesLoading(true);
      setMessagesError("");

      try {
        const response = await axios.get(getMessagesApi, {
          params: {
            senderId: user._id,
            receiverId: selectedUser._id,
          },
          withCredentials: true,
        });

        if (isCurrentRequest) {
          setMessages(
            (response.data.data ?? []).map((message) => ({
              ...message,
              message: message.content,
            }))
          );
        }
      } catch (error) {
        if (isCurrentRequest) {
          setMessages([]);
          setMessagesError(
            error.response?.data?.error || "Unable to load messages"
          );
        }
      } finally {
        if (isCurrentRequest) {
          setMessagesLoading(false);
        }
      }
    };

    getMessages();

    return () => {
      isCurrentRequest = false;
    };
  }, [selectedUser?._id, user?._id]);

  const selectUser = (nextUser) => {
    setSelectedUser(nextUser);
    setShowChat(true);
    setMessages([]);
    setMessagesError("");
  };

  const showUserList = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  const sendMessage = (message) => {
    if (!message.trim()) {
      return;
    }

    if (!user?._id || !selectedUser?._id) return;

    const clientMessageId = `${user._id}-${Date.now()}`;
    const newMessage = {
      id: clientMessageId,
      clientMessageId,
      sender: user?._id,
      receiver: selectedUser?._id,
      message: message,
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit(
      "send_message",
      {
        receiverId: selectedUser._id,
        content: message,
        clientMessageId,
      },
      (response) => {
        if (response?.ok) return;

        setMessages((prev) =>
          prev.filter((currentMessage) => currentMessage.clientMessageId !== clientMessageId),
        );
        setMessagesError(response?.error || "Unable to send message");
      },
    );
  };

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        user={user}
        selectedUser={selectedUser}
        onSelectUser={selectUser}
        onlineUsers={onlineUsers}
        stats={stats}
        onStatsUpdate={setStats}
        className={showChat ? "hidden md:flex" : "flex"}
      />

      {/* Chat Area */}
      <main
        className={`${showChat ? "flex" : "hidden md:flex"} flex-1 min-w-0 min-h-0 flex-col bg-white`}
      >
        {!selectedUser ? (
          /* Empty Chat View */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50">
            <div className="max-w-lg w-full p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Welcome to Palm Chat
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm">
                Select any contact from the left sidebar to view message history and start real-time messaging.
              </p>

              {/* Assignment Overview Stats */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 font-medium">Total Users</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{stats.totalUsers || 0}</p>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
                  <p className="text-xs text-emerald-700 font-medium">Live Online</p>
                  <p className="text-lg font-bold text-emerald-700 mt-0.5">{onlineUsers.length || 1}</p>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center">
                  <p className="text-xs text-indigo-700 font-medium">Total Messages</p>
                  <p className="text-lg font-bold text-indigo-700 mt-0.5">{stats.totalMessages || 0}</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Socket Connected</span>
                </div>
                <div>
                  Logged in as <strong className="text-slate-800 font-semibold">{user?.name || "User"}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat View */
          <>
            <ChatHeader
              selectedUser={selectedUser}
              isOnline={onlineUsers.includes(selectedUser?._id)}
              onBack={showUserList}
            />

            <MessageList
              messages={messages}
              user={user}
              loading={messagesLoading}
              error={messagesError}
            />

            <MessageInput
              onSend={sendMessage}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
