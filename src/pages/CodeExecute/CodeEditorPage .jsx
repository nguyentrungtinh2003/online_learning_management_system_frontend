import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { MdDeleteForever } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast, Slide } from "react-toastify";
import { FaCode } from "react-icons/fa";

const CodeEditorPage = () => {
  const { t } = useTranslation("codeeditor");

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
    <div className="w-full h-fit dark:border dark:border-darkBorder p-2 bg-wcolor dark:bg-darkBackground rounded-2xl shadow-2xl font-mono">
      <div className="flex">
        <h2 className="text-2xl font-bold text-cyan-500 flex items-center gap-2">
          {t("codeEditor.title")}
          <span className="text-sm text-gray-700 dark:text-darkText">
            ({t("codeEditor.subtitle")})
          </span>
        </h2>

        <div className="ml-4 flex items-center gap-4">
          <label className="text-lg flex text-gray-700 dark:text-darkText items-center gap-2">
            <FaCode size={30} className="text-cyan-500" />
            {t("codeEditor.language")}:
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
          {t("codeEditor.clear")}
        </button>
      </div>

      {/* Màn hình chính */}
      <div className="flex mt-2 h-[410px] gap-4">
        {/* Lịch sử bên trái */}
        <div className="w-1/4 border-2 dark:border-darkBorder rounded-lg overflow-y-auto bg-wcolor dark:bg-darkSubbackground px-2 space-y-3 max-h-full">
          <h3 className="text-lg bg-wcolor dark:bg-darkSubbackground font-semibold text-cyan-500 sticky top-0 z-5 py-2">
            {t("codeEditor.history")}
          </h3>
          {historyCode && historyCode.length > 0 ? (
            historyCode.map((hisco, index) => (
              <div
                key={index}
                className={`relativegit rounded-r-lg px-3 py-2 shadow ${
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
                  className="cursor-pointer dark:text-darkText"
                >
                  <p className="text-sm mb-1">
                    <span className="font-semibold text-cyan-500">
                      {t("codeEditor.code")}:
                    </span>{" "}
                    {hisco.code}
                  </p>
                  <p className="text-xs text-cyan-500">
                    <span className="font-semibold">
                      {t("codeEditor.time")}:
                    </span>{" "}
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
                  className="absolute -top-1 right-0 text-red-500 hover:text-red-700"
                  title={t("codeEditor.delete")}
                >
                  x
                </button>
              </div>
            ))
          ) : (
            <p className="text-cyan-500">{t("codeEditor.noHistory")}</p>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 border-2 dark:border-darkBorder text-gray-500 rounded-lg overflow-hidden shadow-inner">
          <Editor
            height="100%"
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
      <div className="mt-4 border-2 dark:border-darkBorder rounded-lg shadow-inner">
        <div className="flex justify-between items-center px-4 py-2 border-b dark:border-darkBorder rounded-t-lg">
          <span className="text-cyan-500 font-semibold">
            {t("codeEditor.terminal")}
          </span>
          <button
            onClick={handleRun}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-4 py-2 rounded shadow-sm transition duration-200"
          >
            {loading ? (
              <Spinner animation="border" variant="white" />
            ) : (
              t("codeEditor.run")
            )}
          </button>
        </div>
        <div className="p-2 rounded-b-lg overflow-auto dark:text-darkText text-sm leading-relaxed h-[100px] font-mono">
          <pre className="whitespace-pre-wrap">
            PS {localStorage.getItem("username") || "user"}&gt; {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
