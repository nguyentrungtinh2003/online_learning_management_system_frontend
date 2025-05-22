import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import axios from "axios";
import URL from "../../config/URLconfig";

const CodeEditorPage = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python"); // Default
  const [output, setOutput] = useState("");

  const userId = parseInt(localStorage.getItem("id"));

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("myCoolTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "", foreground: "ffffff" }, // toàn bộ chữ trắng
          { token: "comment", foreground: "999999", fontStyle: "italic" },
          { token: "keyword", foreground: "ff007f" }, // màu hồng cho từ khóa
          { token: "number", foreground: "00ffff" }, // xanh ngọc
          { token: "string", foreground: "00ff00" }, // chuỗi màu xanh lá
        ],
        colors: {
          "editor.background": "#1e1e1e", // màu nền
        },
      });

      monaco.editor.setTheme("myCoolTheme");
    }
  }, [monaco]);

  const handleRun = async () => {
    const languageMap = {
      python: 71,
      cpp: 54,
      java: 62,
      javascript: 63,
    };

    const requestData = {
      code, // đảm bảo không rỗng!
      language: languageMap[language].toString(),
      userId: userId,
    };

    // Kiểm tra xem code và language có rỗng không
    if (!requestData.code || !requestData.language) {
      alert("Code hoặc ngôn ngữ bị thiếu!");
      return;
    }

    console.log("Data gửi đi:", requestData);

    try {
      const res = await axios.post(
        `${URL}/execution-code/compiler`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setOutput(res.data.data || "No output");
    } catch (err) {
      console.error("Lỗi khi gọi API:", err.response?.data || err.message);
      setOutput("Lỗi khi thực thi mã!", err.response?.data || err.message);
    }
  };

  return (
    <div className="w-full mx-auto mt-2 px-6 py-8 bg-[#1e1e1e] rounded-2xl shadow-2xl font-mono">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        Code Editor{" "}
        <span className="text-sm text-gray-400">
          (Luyện code ngay hôm nay !)
        </span>
      </h2>

      {/* Chọn ngôn ngữ */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-white text-lg">Ngôn ngữ:</label>
        <select
          className="bg-[#2d2d2d] text-white border border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Khu vực editor và terminal */}
      <div className="flex gap-6 h-[450px]">
        {/* Editor bên trái */}
        <div className="w-2/3 border-2 border-gray-700 rounded-lg overflow-hidden shadow-inner">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>

        {/* Terminal bên phải, gồm nút chạy và output nằm dưới */}
        <div className="w-1/3 flex flex-col border-2 border-gray-700 rounded-lg shadow-inner bg-[#1e1e1e]">
          <button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-t-lg shadow-md transition duration-200"
          >
            Run
          </button>

          <div className="flex-grow bg-black rounded-b-lg p-4 overflow-auto font-mono text-green-400 text-sm leading-relaxed">
            <pre className="whitespace-pre-wrap">
              {output || "Không có kết quả."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
