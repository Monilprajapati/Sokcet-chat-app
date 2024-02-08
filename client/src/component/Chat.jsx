// import React from "react";
// import "../App.css";
// const rooms = ["general", "random", "jokes", "javascript"];

// const Chat = (props) => {
  
//   function renderRooms(room) {
//     const currentChat = {
//       chatName: room,
//       isChannel: true,
//       receiverId: "",
//     };

//     return (
//       <div
//         key={room}
//         className="row"
//         onClick={() => {
//           props.toggleChat(currentChat);
//         }}
//       >
//         {room}
//       </div>
//     );
//   }

//   function renderUser(user) {
    
//     if (user.id == props.yourId) {
//       return (
//         <div className="row" key={user.id}>
//           You: {user.username}
//         </div>
//       );
//     }

//     const currentChat = {
//       chatName: user.username,
//       isChannel: false,
//       receiverId: user.id,
//     };

//     return (
//       <div
//         onClick={() => {
//           props.toggleChat(currentChat);
//         }}
//         key={user.id}
//       >
//         {user.username}
//       </div>
//     );
//   }

//   function renderMessages(message, index) {
//     return (
//       <div key={index}>
//         <div>
//           {message.sender}: {message.content}
//         </div>
//       </div>
//     );
//   }

//   let body;
//   if (
//     !props.currentChat.isChannel ||
//     props.connectedRooms.includes(props.currentChat.chatName)
//   ) {
//     body = <div className="messages">{props.messages.map(renderMessages)}</div>;
//   } else {
//     body = (
//       <button onClick={() => props.joinRoom(props.currentChat.chatName)}>
//         Join {props.currentChat.chatName}
//       </button>
//     );
//   }

//   function handleKeyPress(e) {
//     if (e.key === "Enter") {
//       props.sendMessage();
//     }
//   }

//   return (
//     <div className="container">
//       <div className="sidebar">
//         <h3>Channels</h3>
//         {rooms.map(renderRooms)}
//         <h3>All Users</h3>
//         {/* {props?.allUsers.map(renderUser)} */}
//         {
//             props.allUsers.map(renderUser)
//         }
//       </div>
//       <div className="chatPanel">
//         <div className="channelInfo">{props.currentChat.chatName}</div>
//         <div className="bodyContainer">{body}</div>
//         <div className="textBox">
//           <input
//             className="textBox"
//             type="text"
//             value={props.message}
//             onChange={props.handleMessageChange}
//             onKeyDown={handleKeyPress}
//             placeholder="Enter your message..."
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
