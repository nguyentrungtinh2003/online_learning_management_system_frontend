import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import URLSocket from "../../config/URLsocket";
import URL from "../../config/URLconfig";
import { Spinner } from "react-bootstrap";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(1);
  const [chatRoomId, setChatRoomId] = useState(44);
  const [content, setContent] = useState("");

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const user1Id = parseInt(localStorage.getItem("id"));
  const user2Id = currentTeacher;

  const [loadingChatRoom, setLoadingChatRoom] = useState(false);

  // Lấy danh sách giảng viên
  const getTeachers = () => {
    axios
      .get(`${URL}/user/all`, { withCredentials: true })
      .then((response) => {
        setTeachers(response.data.data);
      })
      .catch((error) => {
        console.log("Error get all teacher!" + error.message);
      });
  };

  const getChatByChatRoomId = () => {
    console.log("Chat-room id " + chatRoomId);
    setLoadingChatRoom(true);
    axios
      .get(`${URL}/chats/chat-room/${parseInt(chatRoomId)}`, {
        withCredentials: true,
      })
      .then((response) => {
        setMessages(response.data.data);
        setLoadingChatRoom(false);
      })
      .catch((error) => {
        console.log("Error get chat by chat room!" + error.message);
      });
  };

  // Gửi tin nhắn qua API và publish qua STOMP
  const addChat = () => {
    if (!content.trim()) return;
    axios
      .post(
        `${URL}/chats/add`,
        { user1Id, user2Id, chatRoomId, message: content },
        { withCredentials: true }
      )
      .then((response) => {
        const savedMessage = response.data.data;
        // Gửi tin nhắn qua WebSocket (STOMP)
        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.publish({
            destination: `/app/chat-room/${chatRoomId}`,
            body: JSON.stringify(savedMessage),
          });
        }
        setContent("");
      })
      .catch((error) => {
        console.log("Error add chat!" + error.message);
      });
  };

  const deleteChat = (chatId) => {
    axios
      .delete(
        `${URL}/chats/delete/${chatId}`,

        { withCredentials: true }
      )
      .then((response) => {
        console.log("Delete chat success");
      })
      .catch((error) => {
        console.log("Error add chat!" + error.message);
      });
  };

  // Tự động scroll đến tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getTeachers();
  }, []);

  useEffect(() => {
    getChatByChatRoomId();
  }, []);

  // Gọi API tạo hoặc lấy chatRoom khi chọn giảng viên
  useEffect(() => {
    if (!currentTeacher) return;
    axios
      .post(
        `${URL}/chat-room/add`,
        { user1Id, user2Id },
        { withCredentials: true }
      )
      .then((response) => {
        setChatRoomId(response.data.data.id);
      })
      .catch((error) => {
        console.log("Error create chat room!" + error.message);
      });
  }, [currentTeacher]);

  useEffect(() => {
    if (!chatRoomId || isNaN(chatRoomId)) return;
    getChatByChatRoomId();
  }, [chatRoomId]);

  // Kết nối WebSocket khi có chatRoomId
  useEffect(() => {
    if (!chatRoomId) return;

    const socket = new SockJS(`${URLSocket}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/chat-room/${chatRoomId}`, (message) => {
          const chat = JSON.parse(message.body);
          setMessages((prev) => [...prev, chat]);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [chatRoomId]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex">
      {/* Danh sách giảng viên */}
      <div className="w-64 bg-white p-4 border rounded-lg shadow-lg mr-4">
        <h3 className="text-lg font-semibold mb-4">Chọn người dùng:</h3>
        <div className="flex flex-col space-y-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className={`cursor-pointer p-2 rounded-lg ${
                currentTeacher === teacher.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setCurrentTeacher(teacher.id)}
            >
              <img
                src={teacher.img || "/user.png"}
                alt={teacher.username}
                className="w-10 h-10 rounded-full mx-auto"
              />
              <div className="text-center">
                {teacher.username}{" "}
                {currentTeacher === teacher.id && loadingChatRoom ? (
                  <Spinner animation="border" variant="white" />
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khung chat */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-100 flex flex-col space-y-3">
        <h2 className="text-xl font-semibold mb-4 text-center">
          💬 Phòng Chat
          {loadingChatRoom ? <Spinner animation="border" variant="blue" /> : ""}
        </h2>

        <div className="flex-1 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                msg.user1Id === user1Id
                  ? "ml-auto flex-row-reverse"
                  : "mr-auto flex-row"
              }`}
            >
              <img
                src={msg.img || "/user.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="d-flex">
                  <div
                    className={`p-3 rounded-2xl max-w-xs break-words ${
                      msg.user1Id === user1Id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div>
                    {msg.user1Id === parseInt(localStorage.getItem("id")) ? (
                      <>
                        <button
                          onClick={() => deleteChat(parseInt(msg.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white text-sm"
                        >
                          X
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.user1Id === user1Id ? "text-right" : ""
                  }`}
                >
                  {msg.timeStamp
                    ? new Date(
                        msg.timeStamp[0],
                        msg.timeStamp[1] - 1,
                        msg.timeStamp[2],
                        msg.timeStamp[3],
                        msg.timeStamp[4],
                        msg.timeStamp[5]
                      ).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Form nhập tin nhắn */}
        <div className="flex mt-4 space-x-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
            placeholder="Nhập tin nhắn..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addChat();
              }
            }}
          />

          <button
            onClick={addChat}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
