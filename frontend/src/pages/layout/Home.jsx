import { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import ChatHeader from "../chat/ChatHeader";
import MessageList from "../chat/MessageList";
import MessageInput from "../chat/MessageInput";
import { getMessagesApi } from "../../services/api";
import axios from "axios";
import socket from "../../services/socket";


const Home = ({ user }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");


  useEffect(() => {
    if (!user?._id) return;

    const joinUser = () => socket.emit("join_user", user._id);
    socket.on("connect", joinUser);
    joinUser();

    return () => socket.off("connect", joinUser);
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
    <div className="h-screen w-full overflow-hidden flex flex-col md:flex-row bg-gray-100">

      {/* Sidebar */}
      <Sidebar
        user={user}
        selectedUser={selectedUser}
        onSelectUser={selectUser}
        className={showChat ? "hidden md:flex" : "flex"}
      />

      {/* Chat Area */}
      <main
        className={`${showChat ? "flex" : "hidden md:flex"} flex-1 min-w-0 min-h-0 flex-col`}
      >

        {!selectedUser ? (
          /* Empty Chat */
          <div className="flex-1 flex items-center justify-center">

            <div className="text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                💬
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mt-5">
                Welcome to Palm Chat
              </h2>

              <p className="text-gray-500 mt-2">
                Select a person from the sidebar to start chatting.
              </p>

            </div>

          </div>
        ) : (
          /* Chat */
          <>

            {/* Chat Header */}
            <ChatHeader
              selectedUser={selectedUser}
              onBack={showUserList}
            />

            {/* Messages */}
            <MessageList
              messages={messages}
              user={user}
              loading={messagesLoading}
              error={messagesError}
            />

            {/* Message Input */}
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