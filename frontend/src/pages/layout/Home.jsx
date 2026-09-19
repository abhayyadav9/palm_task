import { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import ChatHeader from "../chat/ChatHeader";
import MessageList from "../chat/MessageList";
import MessageInput from "../chat/MessageInput";
import { getMessagesApi, sendMessageApi } from "../../services/api";
import axios from "axios";


const Home = ({ user }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");

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

  const sendMessage = async(message) => {
    if (!message.trim()) {
      return;
    }

    const temporaryMessageId = Date.now();
    const newMessage = {
      id: temporaryMessageId,
      sender: user?._id,
      message: message,
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    try {
      const response = await axios.post(sendMessageApi, {
        senderId: user?._id,
        receiverId: selectedUser?._id,
        content: message,
      }, {
        withCredentials: true,
      });

      const savedMessage = response.data.data;
      if (savedMessage) {
        setMessages((prev) => prev.map((currentMessage) => (
          currentMessage.id === temporaryMessageId
            ? { ...savedMessage, message: savedMessage.content }
            : currentMessage
        )));
      }


    }catch (error) {
      console.error("Error sending message:", error);
    }
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