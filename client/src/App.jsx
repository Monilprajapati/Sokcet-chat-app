import React from "react";
import { useState, useEffect, useRef } from "react";
import { enableMapSet } from "immer";
import Chat from "./component/Chat";
import Form from "./component/Form";
import io from "socket.io-client";
enableMapSet();

import { produce } from "immer";

let initialMessages = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],
};

const App = () => {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    receiverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function getUsers() {
    socketRef.current.emit("get users", (users) => {
      setAllUsers(users);
    });
  }

  function getMessages(chatName) {
    socketRef.current.emit("get messages", chatName, (chatMessages) => {
      // Update messages state for the specified chat
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatName]: chatMessages,
      }));
    });
  }
  
  // Call the function to get messages for the initial chat when needed
  useEffect(() => {
    if (connected) {
      getMessages(currentChat.chatName);
    }
  }, [connected, connectedRooms]);
  

  useEffect(() => {
    if (connected) {
      getUsers();
    }
  }, [connected]);

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };

    socketRef.current.emit("send message", payload);

    const newMessages = produce(messages, (draft) => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessages);
  }

  function joinRoomCallback(incomingMessages, room) {
    const newMessages = produce(messages, (draft) => {
      draft[room] = incomingMessages[room] || [];
    });
    setMessages(newMessages);
  }

  function joinRoom(room) {
    const newConnectedRooms = produce(connectedRooms, (draft) => {
      draft.push(room);
    });

    socketRef.current.emit("join room", room, (messages) => {
      joinRoomCallback(messages, room);
    });

    setConnectedRooms(newConnectedRooms);
  }

  function toggleChat(currentChat) {
    if (!messages[currentChat.chatName]) {
      const newMessages = produce(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  function handleChange(e) {
    setUsername(e.target.value);
  }

  function connect() {
    setConnected(true);
    socketRef.current = io.connect("http://localhost:3200");
    socketRef.current.emit("join server", username);
    socketRef.current.emit("join room", "general", (message) => {
      joinRoomCallback(message, "general");
    });

    socketRef.current.on("new user", (user) => {
      setAllUsers((users) => {
        return [...users, user];
      });
    });

    socketRef.current.on("new message", ({ content, sender, chatName }) => {
      setMessages((messages) => {
        const newMessages = produce(messages, (draft) => {
          if (draft[chatName]) {
            draft[chatName].push({ sender, content });
          } else {
            draft[chatName] = [{ sender, content }];
          }
        });
        return newMessages;
      });
    });
  }
  console.log(allUsers);
  console.log(typeof allUsers);
  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  } else {
    body = (
      <Form username={username} onChange={handleChange} connect={connect} />
    );
  }
  return <div>{body}</div>;
};

export default App;
