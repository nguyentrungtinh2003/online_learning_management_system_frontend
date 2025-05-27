import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { MdDeleteForever } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast, Slide } from "react-toastify";
import { FaCode, FaTrash } from "react-icons/fa";

const CodeEditorPage = () => {
  const { t, i18n } = useTranslation("codeeditor");

  const [code, setCode] = useState("");
  const [codeId, setCodeId] = useState(null);
  const [language, setLanguage] = useState("javascript"); // Default
  const [output, setOutput] = useState("");
  const [historyCode, setHistoryCode] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = parseInt(localStorage.getItem("id"));
  const monaco = useMonaco();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Lắng nghe thay đổi darkmode nếu người dùng có thể bật/tắt nó runtime
  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(current);
    }, 100); // kiểm tra mỗi 0.5s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!monaco) return;

    monaco.editor.defineTheme("custom-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#000000",
      },
    });

    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e293b", // Tương đương Tailwind dark:bg-darkBackground
        "editor.foreground": "#e5e7eb", // Tương đương text-gray-200
      },
    });

    monaco.editor.setTheme(isDarkMode ? "custom-dark" : "custom-light");
  }, [monaco, isDarkMode]);
  //date
  function formatDate(dateArray) {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return "N/A";

    const postDate = new Date(
      dateArray[0], // year
      dateArray[1] - 1, // ✅ month (JS: 0-indexed)
      dateArray[2], // day
      dateArray[3], // hour
      dateArray[4], // minute
      dateArray[5] // second
      // dateArray[6] là nano giây, không cần thiết ở đây
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
    const isConfirm = window.confirm(
      "Bạn có muốn xoá lịch sử code này không ?"
    );

    if (isConfirm) {
      axios
        .delete(`${URL}/code/user/delete/${id}`, { withCredentials: true })
        .then((response) => {
          toast.success("Xoá lịch sử code thành công !", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          setTimeout(() => {
            historyCodeByUser();
          }, 1000);
        })
        .catch((error) => {
          console.log("Error delete code  : ", error.message);
        });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 h-fit dark:border dark:border-darkBorder p-2 bg-wcolor dark:bg-darkBackground rounded-2xl shadow-2xl font-mono">
      <div className="flex px-2">
        <h2 className="text-2xl font-bold text-cyan-500 flex items-center gap-2">
          {t("title")}
          <span className="text-sm text-gray-700 dark:text-darkText">
            ({t("subtitle")})
          </span>
        </h2>

        <div className="ml-4 flex items-center gap-4">
          <label className="text-lg flex text-gray-700 dark:text-darkText items-center gap-2">
            <FaCode size={30} className="text-cyan-500" />
            {t("language")}:
          </label>
          <select
            className="text-gray-700 bg-wcolor dark:bg-darkSubbackground dark:text-darkText px-4 py-2 border-2 dark:border-darkBorder border-gray-600 rounded-xl shadow-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
        <button
          className="bg-red-500 ml-2 border-2 dark:border-darkBorder text-white p-2 rounded hover:bg-red-600 transition"
          onClick={() => {
            setCodeId(null);
            setCode(null);
          }}
        >
          {t("clear")}
        </button>
      </div>

      {/* Màn hình chính */}
      <div className="flex h-[415px] gap-2">
        {/* Lịch sử bên trái */}
        <div className="w-1/4 border-2 dark:border-darkBorder rounded-lg overflow-y-auto bg-wcolor dark:bg-darkSubbackground space-y-3 max-h-full">
          <h3 className="text-lg h-10 w-full bg-wcolor dark:bg-darkSubbackground font-semibold text-cyan-500 sticky  top-0 z-10 py-2 px-3 rounded">
            {t("history")}
          </h3>
          {historyCode && historyCode.length > 0 ? (
            historyCode.map((hisco, index) => (
              <div
                key={index}
                className={`relative mx-2 rounded-r-lg px-3 py-2 shadow ${
                  codeId == hisco.id
                    ? `border-l-4 border-cyan-500`
                    : `hover:border-l-4 border-cyan-500`
                } `}
              >
                <div
                  onClick={() => {
                    setCode(hisco.code);
                    setCodeId(hisco.id);
                  }}
                  className="cursor-pointer dark:text-darkText space-y-1"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-cyan-500">
                      {t("code")}:
                    </span>{" "}
                    {hisco.code}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-cyan-500">
                      {t("time")}:
                    </span>{" "}
                    {formatDate(hisco.executedAt)}
                  </p>

                  {hisco.updateDate != null && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-cyan-500">
                        {t("update")}:
                      </span>{" "}
                      {formatDate(hisco.updateDate)}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteCodeByUser(hisco.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title={t("codeEditor.delete")}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="text-cyan-500 px-2">{t("noHistory")}</p>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 border-2 dark:border-darkBorder text-gray-500 rounded-lg overflow-hidden shadow-inner">
          <Editor
            height="110%"
            language={language}
            theme={isDarkMode ? "custom-dark" : "custom-light"}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Terminal */}
      <div className="border-2 dark:border-darkBorder rounded-lg shadow-inner">
        <div className="flex justify-between items-center p-2 border-b dark:border-darkBorder rounded-t-lg">
          <span className="text-cyan-500 font-semibold">{t("terminal")}</span>
          <button
            onClick={handleRun}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-4 py-2 rounded shadow-sm transition duration-200"
          >
            {loading ? (
              <Spinner animation="border" variant="white" />
            ) : (
              t("run")
            )}
          </button>
        </div>
        <div className="p-2 rounded-b-lg overflow-auto dark:text-darkText text-sm leading-relaxed h-[95px] font-mono">
          <pre className="whitespace-pre-wrap">
            PS {localStorage.getItem("username") || "user"}&gt; {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
