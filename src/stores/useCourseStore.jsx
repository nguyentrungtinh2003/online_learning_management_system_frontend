import { create } from "zustand";

const useCourseStore = create((set) => ({
  courses: [],
  search: "",
  loading: true,
  filterType: "All",
  statusFilter: "All",
  cache: new Map(),
  currentPage: 0,
  totalPages: 1,
  coursesPerPage: 6,

  // Các action để cập nhật state
  setCourses: (courses) => set({ courses }),
  setSearch: (search) => set({ search }),
  setLoading: (loading) => set({ loading }),
  setFilterType: (filterType) => set({ filterType }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCache: (cache) => set({ cache }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setTotalPages: (totalPages) => set({ totalPages }),

  // fetchCourses được di chuyển vào store
  fetchCourses: async (
    currentPage,
    search,
    filterType,
    statusFilter,
    cache,
    setCourses,
    setLoading,
    setCache,
    setTotalPages
  ) => {
    setLoading(true);
    try {
      const cacheKey = `${search.trim()}-${filterType}-${statusFilter}`;

      let fetchedCourses;

      // Nếu đã có cache, dùng lại
      if (cache.has(cacheKey)) {
        console.log("Using cache...");
        fetchedCourses = cache.get(cacheKey);
      } else {
        // Gọi API
        const data = await getCoursesByPage(0, 1000);

        if (!data || !data.data || !data.data.content) {
          throw new Error("Invalid API Response");
        }

        fetchedCourses = data.data.content;
        console.log("Fetched Courses from API:", fetchedCourses);

        // Lọc theo search
        if (search.trim() !== "") {
          fetchedCourses = fetchedCourses.filter((course) =>
            course.courseName
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          );
        }

        // Lọc theo giá
        if (filterType === "Free") {
          fetchedCourses = fetchedCourses.filter(
            (course) => course.price === 0 || course.price === null
          );
        } else if (filterType === "Paid") {
          fetchedCourses = fetchedCourses.filter(
            (course) => course.price !== null && course.price > 0
          );
        }

        // Lọc theo trạng thái
        if (statusFilter === "Deleted") {
          fetchedCourses = fetchedCourses.filter((course) => course.deleted);
        } else if (statusFilter === "Active") {
          fetchedCourses = fetchedCourses.filter((course) => !course.deleted);
        }

        // Lưu vào cache
        console.log("Caching fetched courses");
        setCache(new Map(cache.set(cacheKey, fetchedCourses)));
      }

      // Pagination
      const startIndex = currentPage * 6;
      const endIndex = startIndex + 6;
      const paginatedCourses = fetchedCourses.slice(startIndex, endIndex);

      setCourses(paginatedCourses.sort((a, b) => b.id - a.id));
      setTotalPages(Math.ceil(fetchedCourses.length / 6));
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  },
}));

export default useCourseStore;
