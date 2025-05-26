import axios from "axios";
import URL from "../../config/URLconfig";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import DataTableSkeleton from "../../components/SkeletonLoading/DataTableSkeleton";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaUserPlus,
  FaTimes,
  FaEye,
  FaLockOpen,
  FaLock,
} from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { UserSearch } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getUserByPage } from "../../services/userapi";

export default function UserManagement() {
  const { t } = useTranslation("adminmanagement");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [usersSearch, setUsersSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState(new Map());
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const location = useLocation();

  const triggerReload = () => {
    setReloadTrigger((prev) => !prev); // Đổi giá trị để các useEffect phụ thuộc vào reloadTrigger chạy lại
  };

  const [reloadTrigger, setReloadTrigger] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 6;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------------------------------------------------------------------------------------------
  // **Effect 1: Lấy thông tin từ localStorage khi trang load (Lần đầu)**
  useEffect(() => {
    const savedSearch = localStorage.getItem("search");
    const savedFilterType = localStorage.getItem("roleFilter");

    if (savedSearch) setSearch(savedSearch);
    if (savedFilterType) setRoleFilter(savedFilterType);
  }, []); // Chạy một lần khi trang load lần đầu

  // ---------------------------------------------------------------------------------------------------
  // **Effect 2: Lắng nghe sự kiện triggerCourseReload**
  useEffect(() => {
    const handleReload = () => {
      const savedCache = localStorage.getItem("userCache");
      if (savedCache) {
        const parsedCache = new Map(JSON.parse(savedCache));
        setCache(parsedCache);
        setCurrentPage(0);
      }
    };
    window.addEventListener("triggerUserReload", handleReload);

    return () => {
      window.removeEventListener("triggerUserReload", handleReload);
    };
  }, []); // Lắng nghe sự kiện reload từ các trang khác

  // ---------------------------------------------------------------------------------------------------
  // **Effect 3: Lọc khóa học từ cache và phân trang khi cache thay đổi**
  useEffect(() => {
    if (!cache.has("ALL-DATA")) return;

    let filteredUsers = cache.get("ALL-DATA");

    // Lọc theo search
    if (search.trim() !== "") {
      filteredUsers = filteredUsers.filter((users) =>
        users.username.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    if (roleFilter === "Student") {
      filteredUsers = filteredUsers.filter(
        (user) => user.roleEnum === "STUDENT"
      );
    } else if (roleFilter === "Teacher") {
      filteredUsers = filteredUsers.filter(
        (user) => user.roleEnum === "TEACHER"
      );
    }

    // Lọc theo trạng thái
    if (statusFilter === "Deleted") {
      filteredUsers = filteredUsers.filter((user) => user.deleted);
    } else if (statusFilter === "Active") {
      filteredUsers = filteredUsers.filter((user) => !user.deleted);
    }

    // Phân trang
    const startIndex = currentPage * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedCourses = filteredUsers.slice(startIndex, endIndex);

    setUsers(paginatedCourses.sort((a, b) => b.id - a.id));
    setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
    setLoading(false);
  }, [cache, search, roleFilter, statusFilter, currentPage]); // Khi cache hoặc các bộ lọc thay đổi, chạy lại

  // ---------------------------------------------------------------------------------------------------
  // **Effect 4: Fetch các khóa học từ API hoặc cache khi cần thiết**
  useEffect(() => {
    fetchUsers();
  }, [cache, currentPage, reloadTrigger]); // Khi có thay đổi về các bộ lọc hoặc reloadTrigger

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const cacheKey = `${search.trim()}-${roleFilter}-${statusFilter}`;

      let fetchedUsers;

      // ⚡ Nếu đã cache rồi thì dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedUsers = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getUserByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedUsers = data.data.content;

        // Lọc theo search
        if (search.trim() !== "") {
          fetchedUsers = fetchedUsers.filter((user) =>
            user.username.toLowerCase().includes(search.trim().toLowerCase())
          );
        }

        const ALL_KEY = "ALL-DATA";
        if (!cache.has(ALL_KEY)) {
          const data = await getUserByPage(0, 1000);

          if (!data?.data?.content) throw new Error("Invalid API Response");

          const allUsers = data.data.content;

          const newCache = new Map(cache.set(ALL_KEY, allUsers));
          setCache(newCache);
          localStorage.setItem(
            "userCache",
            JSON.stringify(Array.from(newCache.entries()))
          );
        }

        if (roleFilter === "Student") {
          fetchedUsers = fetchedUsers.filter(
            (user) => user.roleEnum === "STUDENT"
          );
        } else if (roleFilter === "Teacher") {
          fetchedUsers = fetchedUsers.filter(
            (user) => user.roleEnum === "TEACHER"
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedUsers = fetchedUsers.filter((user) => user.deleted);
        } else if (statusFilter === "Active") {
          fetchedUsers = fetchedUsers.filter((user) => !user.deleted);
        }

        const newCache = new Map(cache.set(cacheKey, fetchedUsers));
        setCache(newCache);
        localStorage.setItem(
          "userCache",
          JSON.stringify(Array.from(newCache.entries()))
        );
      }

      // Kiểm tra nếu không có kết quả
      if (fetchedUsers.length === 0 && search.trim() !== "") {
        toast.info("No courses found for your search.", {
          position: "top-right",
          autoClose: 1500,
        });
      }

      // Phân trang
      const startIndex = currentPage * usersPerPage;
      const endIndex = startIndex + usersPerPage;
      const paginatedCourses = fetchedUsers.slice(startIndex, endIndex);

      setUsers(paginatedCourses.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedUsers.length / usersPerPage));
    } catch (error) {
      console.error("Error loading courses:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // **Effect 5: Lưu lại các giá trị của search, filterType, và statusFilter vào localStorage**
  // Gọi cái này sau khi add/edit/delete course
  useEffect(() => {
    localStorage.setItem("search", search);
    localStorage.setItem("roleFilter", roleFilter);
    localStorage.setItem("statusFilter", statusFilter);
  }, [search, roleFilter, statusFilter]); // Lưu lại mỗi khi có thay đổi trong các bộ lọc

  // ---------------------------------------------------------------------------------------------------
  // **Effect 6: Lấy dữ liệu từ localStorage và cập nhật cache khi reloadTrigger thay đổi**
  useEffect(() => {
    const savedCache = localStorage.getItem("userCache");
    const savedNewUsers = localStorage.getItem("newUsers");

    if (savedCache) {
      const parsedCache = new Map(JSON.parse(savedCache));

      if (savedNewUsers) {
        const newUsers = JSON.parse(savedNewUsers);
        const key = `${search.trim()}-${roleFilter}-${statusFilter}`;

        const updatedUsers = [...(parsedCache.get(key) || []), ...newUsers];
        parsedCache.set(key, updatedUsers);

        // Lưu lại cache mới vào localStorage
        localStorage.setItem(
          "userCache",
          JSON.stringify(Array.from(parsedCache.entries()))
        );

        // Xóa courses mới đã dùng
        localStorage.removeItem("newUsers");
      }

      setCache(parsedCache);
    }
  }, [reloadTrigger]); // Chạy một lần khi trang được load lần đầu tiên

  // ---------------------------------------------------------------------------------------------------
  // Effect 7: Reset lessonSearch khi có sự thay đổi từ trang khác
  useEffect(() => {
    if (location.pathname.includes("user")) {
      setSearch(""); // Reset khi chuyển sang trang lesson
    }
  }, [location.pathname]); // Lắng nghe sự thay đổi của location.pathname

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrePage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // useEffect(() => {
  //   fetchAllUser();
  // }, []);

  // useEffect(() => {
  //   fetchUsers();
  // }, [currentPage]); // nhớ thêm currentPage vào dependencies

  // const fetchAllUser = () => {
  //   axios
  //     .get(`${URL}/user/all`, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       const fetchedUsers = response.data.data;
  //       setAllUser(fetchedUsers.sort((a, b) => b.id - a.id)); // sắp xếp theo ID
  //     })

  //     .catch((error) => {});
  // };

  // const fetchUsers = () => {
  //   setLoading(true);
  //   axios
  //     .get(`${URL}/admin/user/page?page=${currentPage}&size=${usersPerPage}`, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       const fetchedUsers = response.data.data.content;
  //       setUsers(fetchedUsers.sort((a, b) => b.id - a.id)); // sắp xếp theo ID
  //       setTotalPages(response.data.data.totalPages);
  //       setLoading(false);
  //     })

  //     .catch((error) => {
  //       toast.error("Lỗi khi tải dữ liệu người dùng!", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         transition: Slide,
  //       });
  //       setLoading(false);
  //     });
  // };

  useEffect(() => {
    searchUser();
  }, [search]);

  const searchUser = () => {
    if (search.trim() !== "") {
      axios
        .get(`${URL}/admin/user/search?keyword=${search}`, {
          withCredentials: true,
        })
        .then((response) => {
          setUsers(response.data.data.content); // hoặc response.data nếu không có .data.content
        })
        .catch((error) => {
          toast.error("Lỗi khi tìm kiếm người dùng!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
        });
    } else {
      fetchUsers(); // Gọi lại danh sách người dùng ban đầu
    }
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Bạn có muốn xoá người dùng ${name} không ?`)) {
      axios
        .delete(`${URL}/admin/user/delete/${id}`, { withCredentials: true })
        .then(() => {
          toast.success("Xoá người dùng thành công!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          // Nếu muốn cập nhật lại trạng thái người dùng thay vì xoá khỏi danh sách
          setUsers(
            users.map((user) =>
              user.id === id ? { ...user, deleted: true } : user
            )
          );
        })
        .catch(() => {
          toast.error("Lỗi khi xoá người dùng!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
        });
    }
  };

  const handleRestoreUser = (id, name) => {
    if (window.confirm(`Bạn có muốn mở khoá người dùng ${name} không ?`)) {
      axios
        .put(`${URL}/admin/user/restore/${id}`, {}, { withCredentials: true })
        .then(() => {
          toast.success("Mở khoá người dùng thành công!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });

          // Nếu muốn cập nhật lại trạng thái người dùng thay vì xoá khỏi danh sách
          setUsers(
            users.map((user) =>
              user.id === id ? { ...user, deleted: false } : user
            )
          );
        })
        .catch((error) => {
          toast.error("Lỗi khi mở khoá người dùng!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          console.log("Lỗi restore user : " + error.message);
        });
    }
  };

  // useEffect(() => {
  //   if (roleFilter === "ALL") {
  //     fetchUsers(); // gọi API có phân trang
  //   } else {
  //     const filtered = allUser.filter((user) => user.roleEnum === roleFilter);
  //     setUsers(filtered);
  //   }
  //   setCurrentPage(0);
  // }, [roleFilter, allUser]);

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="h-full flex-1 bg-wcolor dark:border-darkBorder dark:border drop-shadow-xl py-2 px-2 dark:bg-darkBackground rounded-xl pl-2 w-full dark:text-darkText">
      <div className="flex-1 w-full flex flex-col h-full">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center mx-2 gap-2 dark:text-darkText">
            <FaUsers size={isMobile ? 50 : 30} />
            <MdNavigateNext size={isMobile ? 60 : 30} />
            <h2 className="text-4xl lg:text-lg font-bold">{t("user.title")}</h2>
          </div>
          <Link
            className="hover:bg-tcolor cursor-pointer text-gray-600 bg-wcolor px-8 border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText hover:scale-105 hover:text-gray-900 dark:hover:bg-darkHover py-2 rounded-xl"
            to="/admin/users/add-user"
          >
            <FaUserPlus size={isMobile ? 50 : 30} />
          </Link>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col lg:flex-row gap-2 mb-2"
        >
          {/* Ô tìm kiếm */}
          <div className="relative h-24 lg:h-12 w-full">
            <input
              type="text"
              value={search}
              placeholder={t("searchPlaceholder")}
              className="lg:py-2 lg:placeholder:text-base text-4xl lg:text-base placeholder:text-3xl h-full px-3 pr-10 dark:bg-darkSubbackground dark:border-darkBorder dark:placeholder:text-darkSubtext border-2 rounded w-full focus:outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setSearch("")}
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>

          {/* Select lọc theo vai trò */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setCurrentPage(0);
              setRoleFilter(e.target.value);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded w-72 lg:w-48"
          >
            <option value="All">{t("all")}</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>

          {/* Select lọc theo trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="p-2 lg:text-base text-3xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
          >
            <option value="All">{t("all")}</option>
            <option value="Deleted">{t("deleted")}</option>
            <option value="Active">{t("active")}</option>
          </select>

          {/* Nút tìm kiếm */}
          <button
            type="submit"
            className="bg-wcolor lg:text-base text-3xl hover:bg-tcolor dark:hover:bg-darkHover dark:bg-darkSubbackground dark:border-darkBorder border-2 whitespace-nowrap px-4 py-2 rounded hover:scale-105"
          >
            {t("search")}
          </button>
        </form>

        {/* User Table */}
        <div className="flex-1 w-full overflow-auto overflow-x">
          <div className="bg-wcolor lg:px-2 overflow-auto justify-between flex flex-col lg:h-fit h-full dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkSubtext rounded-2xl">
            <table className="lg:w-full w-[200%] h-fit">
              <thead className="sticky top-0 z-10 dark:text-darkText">
                <tr className="border-y lg:h-[5vh] h-[8vh] dark:border-darkBorder text-center lg:text-base text-4xl dark:text-darkText whitespace-nowrap font-bold">
                  <th className="p-2">{t("stt")}</th>
                  <th className="p-2">{t("user.username")}</th>
                  <th className="p-2">{t("user.email")}</th>
                  <th className="p-2">{t("user.phone")}</th>
                  <th className="p-2">{t("user.point")}</th>
                  <th className="p-2">{t("user.rank")}</th>
                  <th className="p-2">{t("status")}</th>
                  <th className="p-2">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(1)].map((_, index) => (
                    <DataTableSkeleton key={index} />
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      {t("user.noUserFound")}
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="text-center dark:border-darkBorder text-4xl lg:text-base border-b hover:bg-tcolor dark:hover:bg-darkHover"
                    >
                      <td className="p-2 lg:h-[8vh] h-[11vh]">
                        {index + 1 + currentPage * usersPerPage}
                      </td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.phoneNumber}</td>
                      <td className="p-2">{user.point}</td>
                      <td className="p-2">{user.rankEnum}</td>
                      <td className="p-2">
                        {!user.deleted ? (
                          <div className="flex justify-center items-center gap-1">
                            <FaCheckCircle className="text-green-500" />
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-1">
                            <FaTimesCircle className="text-red-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-2 h-full items-center flex flex-1 justify-center">
                        <Link
                          to={`/admin/users/view-user/${user.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-green-600 hover:bg-opacity-80 text-white"
                          title="Chỉnh sửa người dùng"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/users/edit-user/${user.id}`}
                          className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white"
                          title="Chỉnh sửa người dùng"
                        >
                          <FaEdit />
                        </Link>
                        {user.deleted ? (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() =>
                              handleRestoreUser(user.id, user.username)
                            }
                            title="Khôi phục người dùng"
                          >
                            <FaLockOpen />
                          </button>
                        ) : (
                          <button
                            className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                            onClick={() =>
                              handleDeleteUser(user.id, user.username)
                            }
                            title="Khóa người dùng"
                          >
                            <FaLock />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex lg:text-base text-3xl pt-2 items-center justify-between">
          <p className="mx-2">
            {t("page")} {currentPage + 1} {t("of")} {totalPages}
          </p>
          <div className="space-x-2">
            <button
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
              onClick={handlePrePage}
              disabled={currentPage === 0}
            >
              <MdNavigateBefore size={isMobile ? 55 : 30} />
            </button>
            <button
              className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 hover:bg-tcolor p-1 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <MdNavigateNext size={isMobile ? 55 : 30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
