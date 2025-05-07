import React, { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import URLSocket from "../../config/URLsocket";
import URL from "../../config/URLconfig";
import { Spinner } from "react-bootstrap";

const ChatRoom = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [content, setContent] = useState("");
  const [loadingChatRoom, setLoadingChatRoom] = useState(false);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const user1Id = parseInt(localStorage.getItem("id"));

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.id !== user1Id &&
      teacher.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchChatRoomAndMessages = useCallback(
    async (teacherId) => {
      setLoadingChatRoom(true);
      try {
        const roomRes = await axios.post(
          `${URL}/chat-room/add`,
          { user1Id, user2Id: teacherId },
          { withCredentials: true }
        );
        const roomId = roomRes.data.data.id;
        setChatRoomId(roomId);

        const messagesRes = await axios.get(
          `${URL}/chats/chat-room/${roomId}`,
          {
            withCredentials: true,
          }
        );
        setMessages(messagesRes.data.data);
      } catch (error) {
        console.log("Error fetching chat room and messages:", error);
      } finally {
        setLoadingChatRoom(false);
      }
    },
    [user1Id]
  );

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}/user/all`, {
        withCredentials: true,
      });
      const allTeachers = response.data.data.filter((t) => t.id !== user1Id);

      const updated = await Promise.all(
        allTeachers.map(async (teacher) => {
          try {
            const res = await axios.post(
              `${URL}/chat-room/add`,
              { user1Id, user2Id: teacher.id },
              { withCredentials: true }
            );
            const roomId = res.data.data.id;

            const chatRes = await axios.get(
              `${URL}/chats/chat-room/${roomId}`,
              {
                withCredentials: true,
              }
            );
            const lastMsg = chatRes.data.data.slice(-1)[0];

            return {
              ...teacher,
              lastMessage: lastMsg
                ? {
                    content: lastMsg.message,
                    sender: lastMsg.user1Id === user1Id ? "user" : "teacher",
                  }
                : null,
            };
          } catch (e) {
            console.log("Error getting last message for teacher", teacher.id);
            return { ...teacher, lastMessage: null };
          }
        })
      );

      setTeachers(updated);
    } catch (error) {
      console.log("Error fetching teachers:", error);
    }
  }, [user1Id]);

  const addChat = async () => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(
        `${URL}/chats/add`,
        { user1Id, user2Id: currentTeacher, chatRoomId, message: content },
        { withCredentials: true }
      );
      const saved = res.data.data;
      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: `/app/chat-room/${chatRoomId}`,
          body: JSON.stringify(saved),
        });
      }
      setContent("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`${URL}/chats/delete/${chatId}`, {
        withCredentials: true,
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === chatId
            ? { ...msg, message: "Tin nhắn đã bị xóa", isDeleted: true }
            : msg
        )
      );
      fetchChatRoomAndMessages();
    } catch (error) {
      console.log("Error deleting chat:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    if (teachers.length > 0 && !currentTeacher) {
      setCurrentTeacher(teachers[0].id);
    }
  }, [teachers, currentTeacher]);

  useEffect(() => {
    if (currentTeacher) fetchChatRoomAndMessages(currentTeacher);
  }, [currentTeacher, fetchChatRoomAndMessages]);

  useEffect(() => {
    if (!chatRoomId) return;

    const socket = new SockJS(`${URLSocket}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/chat-room/${chatRoomId}`, (msg) => {
          const chat = JSON.parse(msg.body);
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

  useEffect(() => {
    if (!teachers.length || !messages.length) return;
    const lastMsg = messages[messages.length - 1];
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === lastMsg.user1Id || teacher.id === lastMsg.user2Id
          ? {
              ...teacher,
              lastMessage: {
                content: lastMsg.message,
                sender: lastMsg.user1Id === user1Id ? "user" : "teacher",
              },
            }
          : teacher
      )
    );
  }, [messages, teachers.length, user1Id]);

  return (
    <div className="w-full flex gap-1">
      {/* Danh sách giảng viên */}
      <div className="w-64 bg-wcolor dark:bg-darkSubbackground dark:border-darkBorder p-4 border-2 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Tìm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full dark:bg-darkBackground dark:border-darkBorder px-3 py-2 mb-4 border-2 rounded-lg focus:outline-none"
        />

        <div className="flex flex-col space-y-4 overflow-y-auto max-h-[500px]">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className={`cursor-pointer p-2 rounded-lg flex items-center gap-3 ${
                currentTeacher === teacher.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-focolor dark:hover:bg-darkBorder dark:text-darkText"
              }`}
              onClick={() => setCurrentTeacher(teacher.id)}
            >
              <img
                src={teacher.img || "/user.png"}
                alt={teacher.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col overflow-hidden">
                <div className="font-semibold truncate">{teacher.username}</div>
                <div className="text-sm text-black-600 dark:text-white-300 truncate">
                  {teacher.lastMessage?.sender === "teacher"
                    ? teacher.lastMessage?.content
                    : `Bạn: ${teacher.lastMessage?.content}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khung chat */}
      <div className="flex-1 overflow-y-auto border-2 dark:text-darkText dark:bg-darkSubbackground dark:border-darkBorder rounded-lg p-4 bg-gray-50 flex flex-col space-y-3 relative">
        {loadingChatRoom ? (
          <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground absolute inset-0 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-darkText text-gray-700">
                💬 Chat với{" "}
                {teachers.find((t) => t.id === currentTeacher)?.username ||
                  "Đang tải..."}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${
                    msg.user1Id === user1Id ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.user1Id !== user1Id && (
                    <img
                      src={
                        msg.user1Img && msg.user1Img !== "null"
                          ? msg.user1Img
                          : "/user.png"
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}

                  <div className="max-w-xs relative group">
                    <div
                      className={`relative p-3 rounded-2xl shadow-md ${
                        msg.user1Id === user1Id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-dark border"
                      }`}
                    >
                      <p className="break-words">
                        {msg.isDeleted ? (
                          <i className="text-sm text-gray-400">
                            Tin nhắn đã bị xóa
                          </i>
                        ) : (
                          msg.message
                        )}
                      </p>
                    </div>

                    {msg.user1Id === user1Id && !msg.isDeleted && (
                      <div className="absolute top-10 -left-10 -translate-y-full">
                        <div className="relative">
                          <button className="text-wcolor text-sm bg-gray-500 rounded-full w-6 h-6 flex items-center justify-center">
                            ⋯
                          </button>
                          <div className="hidden group group-hover:block absolute right-0 mt-1 w-20 bg-wcolor border-2 dark:border-darkBorder rounded shadow-md z-10">
                            <button
                              onClick={() => deleteChat(parseInt(msg.id))}
                              className="block w-full text-left px-3 py-2 dark:bg-darkBackground text-sm text-red-600 hover:bg-gray-100"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        msg.user1Id === user1Id ? "text-right" : "text-left"
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
                          ).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Vừa xong"}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Nhập tin nhắn */}
            <div className="flex mt-4 space-x-2">
              <img
                src={
                  localStorage.getItem("img") !== "null"
                    ? localStorage.getItem("img")
                    : "/user.png"
                }
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border-2 dark:border-darkBorder dark:bg-darkBackground border-gray-300 focus:outline-none"
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Gửi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
