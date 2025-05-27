import axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../config/URLconfig";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const ManagementCourseMaterial = () => {
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10); // Số lượng mỗi trang

  useEffect(() => {
    fetchCourseMaterials();
  }, [page]);

  const fetchCourseMaterials = () => {
    axios
      .get(`${URL}/course-materials/page?page=${page}&size=${size}`, {
        withCredentials: true,
      })
      .then((response) => {
        setCourseMaterials(response.data.data.content);
      })
      .catch((error) => {
        console.log("Lỗi get course material " + error.message);
      });
  };

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có muốn xoá tài liệu ${name} không ?`)) {
      axios
        .delete(`${URL}/course-materials/delete/${parseInt(id)}`, {
          withCredentials: true,
        })
        .then(() => {
          toast.success("Xoá tài liệu thành công!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });

          setCourseMaterials(
            courseMaterials.map((courseMate) =>
              courseMate.id == id
                ? { ...courseMate, deleted: true }
                : courseMate
            )
          );
        })
        .catch(() => {
          toast.error("Lỗi khi xoá tài liệu!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
        });
    }
  };

  const handleRestore = (id, name) => {
    if (window.confirm(`Bạn có muốn mở khoá tài liệu ${name} không ?`)) {
      axios
        .put(
          `${URL}/course-materials/restore/${parseInt(id)}`,
          {},
          { withCredentials: true }
        )
        .then(() => {
          toast.success("Mở khoá tài liệu thành công!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });

          setCourseMaterials(
            courseMaterials.map((courseMate) =>
              courseMate.id == id
                ? { ...courseMate, deleted: false }
                : courseMate
            )
          );
        })
        .catch((error) => {
          toast.error("Lỗi khi mở khoá tài liệu!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          console.log("Lỗi restore tài liệu : " + error.message);
        });
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="mb-3">Quản lí tài liệu học</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <a href="/admin/course-material/add">
          <button className="btn btn-primary">Thêm tài liệu</button>
        </a>
        <div>
          <button className="btn btn-secondary me-2" onClick={prevPage}>
            Trang trước
          </button>
          <button className="btn btn-secondary" onClick={nextPage}>
            Trang sau
          </button>
        </div>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Tệp</th>
            <th>Ngày đăng</th>
            <th>Ngày cập nhật</th>
            <th>Khóa học</th>
            <th>Giảng viên</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {courseMaterials.length > 0 ? (
            courseMaterials.map((material) => (
              <tr key={material.id}>
                <td>{material.id}</td>
                <td>{material.title}</td>
                <td>{material.description}</td>
                <td>
                  <a
                    href={material.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem tệp
                  </a>
                  {" | "}
                  <a href={material.file} download>
                    Tải xuống
                  </a>
                </td>

                <td>{material.uploadDate?.slice(0, 10)}</td>
                <td>{material.updateDate?.slice(0, 10)}</td>
                <td>{material.courseName}</td>
                <td>{material.lecturerName}</td>
                <td>
                  <a
                    href={`/admin/course-material/edit/${material.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Sửa
                  </a>
                  {material.deleted ? (
                    <button
                      className="p-2 border-2 dark:border-darkBorder rounded text-white bg-blue-600 hover:bg-blue-500"
                      onClick={() =>
                        handleRestore(material.id, material.courseName)
                      }
                    >
                      <FaLockOpen />
                    </button>
                  ) : (
                    <button
                      className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                      onClick={() =>
                        handleDelete(material.id, material.courseName)
                      }
                    >
                      <FaLock />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                Không có tài liệu nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManagementCourseMaterial;
