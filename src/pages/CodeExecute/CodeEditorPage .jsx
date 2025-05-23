import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { MdDeleteForever } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CodeEditorPage = () => {
  const { t } = useTranslation();

  const [code, setCode] = useState("");
  const [codeId, setCodeId] = useState(null);
  const [language, setLanguage] = useState("javascript"); // Default
  const [output, setOutput] = useState("");
  const [historyCode, setHistoryCode] = useState([]);
  const [loading, setLoading] = useState(false);

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
          { token: "keyword", foreground: "00bb00" }, // xanh
          { token: "number", foreground: "00ffff" }, // xanh ngọc
          { token: "string", foreground: "00ff00" }, // chuỗi xanh lá
        ],
        colors: {
          "editor.background": "#1e1e1e", // giống VS Code
          "editor.foreground": "#ffffff",
        },
      });

      monaco.editor.setTheme("myCoolTheme");
    }
  }, [monaco]);
  //date
  function formatDate(dateArray) {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return "N/A";

    const postDate = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );

    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const secondsIn20Days = 20 * 24 * 60 * 60;

    if (diffInSeconds >= secondsIn20Days) {
      return postDate.toLocaleString(i18n.language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (diffInSeconds < 60) {
      return t("justNow");
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t("minutesAgo", { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t("hoursAgo", { count: hours });
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return t("daysAgo", { count: days });
    }
  }
  //-

  useEffect(() => {
    historyCodeByUser();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    const languageMap = {
      python: 71,
      cpp: 54,
      java: 62,
      javascript: 63,
    };

    const requestData = {
      id: codeId,
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
      const res = await axios.post(`${URL}/code/compiler`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setOutput(res.data.data || "No output");
      setLoading(false);
      historyCodeByUser();
    } catch (err) {
      console.error("Lỗi khi gọi API:", err.response?.data || err.message);
      setOutput("Lỗi khi thực thi mã!", err.response?.data || err.message);
      setLoading(false);
    }
  };

  const historyCodeByUser = () => {
    axios
      .get(`${URL}/code/user/${userId}`, { withCredentials: true })
      .then((response) => {
        const historyFilter = response.data.data;
        setHistoryCode(historyFilter.reverse());
      })
      .catch((error) => {
        console.log("Error get code history : ", error.message);
      });
  };

  const deleteCodeByUser = (id) => {
    axios
      .delete(`${URL}/code/user/delete/${id}`, { withCredentials: true })
      .then((response) => {
        historyCodeByUser();
      })
      .catch((error) => {
        console.log("Error delete code  : ", error.message);
      });
  };

  return (
    <div className="w-full bg-[#1e1e1e] rounded-2xl shadow-2xl font-mono">
      <div className="flex">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Code Editor{" "}
          <span className="text-sm text-gray-400">
            (Luyện code ngay hôm nay!)
          </span>
        </h2>

        {/* Chọn ngôn ngữ */}
        <div className=" ml-4 flex items-center gap-4">
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
      </div>

      {/* Màn hình chính */}
      <div className="flex mt-2 h-[410px] gap-4">
        {/* Lịch sử bên trái */}
        <div className="w-1/4 border border-gray-600 rounded-lg overflow-y-auto bg-[#2d2d2d] p-3 space-y-3 max-h-full">
          <h3 className="text-lg font-semibold text-white mb-2">
            Lịch sử chạy code
          </h3>
          {historyCode && historyCode.length > 0 ? (
            historyCode.map((hisco, index) => (
              <div
                key={index}
                className="relative bg-[#1e1e1e] text-white rounded-lg px-3 py-2 border-l-4 border-green-500 shadow"
              >
                <div
                  onClick={() => {
                    setCode(hisco.code);
                    setCodeId(hisco.id);
                  }}
                  className="cursor-pointer"
                >
                  <p className="text-sm mb-1">
                    <span className="font-semibold text-green-400">Mã:</span>{" "}
                    {hisco.code}
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold">Lúc:</span>{" "}
                    {new Date(
                      hisco.executedAt[0],
                      hisco.executedAt[1] - 1,
                      hisco.executedAt[2],
                      hisco.executedAt[3],
                      hisco.executedAt[4],
                      hisco.executedAt[5]
                    ).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                      ? formatDate(hisco.executedAt)
                      : "N/A"}
                  </p>
                </div>

                {/* Nút xoá */}
                <button
                  onClick={() => deleteCodeByUser(hisco.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Xoá"
                >
                  <MdDeleteForever />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Chưa có lịch sử nào.</p>
          )}
        </div>

        {/* Editor ở giữa */}
        <div className="flex-1 border border-gray-600 rounded-lg overflow-hidden shadow-inner">
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
      </div>

      {/* Terminal dưới */}
      <div className="mt-4 border border-gray-600 rounded-lg bg-[#1e1e1e] shadow-inner">
        <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-gray-700 rounded-t-lg">
          <span className="text-white font-semibold">Terminal</span>
          <button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow-sm transition duration-200"
          >
            {loading ? <Spinner animation="border" variant="white" /> : "Run"}
          </button>
        </div>
        <div className="p-4 bg-black rounded-b-lg overflow-auto text-green-400 text-sm leading-relaxed h-[100px]">
          <pre className="whitespace-pre-wrap">
            {output || "Không có kết quả."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
