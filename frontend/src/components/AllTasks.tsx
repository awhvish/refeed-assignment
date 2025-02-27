"use client";

import axiosInstance from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";

const AllTasks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [tasks, setTasks] = useState<
    { _id: string; title: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const filterParam = searchParams.get("filter");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(filterParam && { filter: filterParam }),
      }).toString();

      const response = await axiosInstance.get(`/tasks?${params}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      setTasks(response.data.tasks);
      setTotalPages(Math.ceil(response.data.total / limit));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, searchQuery, searchParams.get("filter")]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const applyFilter = async (filterValue = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(filterValue && { filter: filterValue }),
      }).toString();

      const response = await axiosInstance.get(`/tasks?${params}`);
      setTasks(response.data.tasks);
      setTotalPages(Math.ceil(response.data.total / limit));
    } catch (error) {
      console.error("Error filtering tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="px-16 xl:px-24">
      <header className="flex items-center justify-center text-2xl font-semibold py-4">
        All your current tasks:
      </header>
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">
          <Filter></Filter>
          Filter
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <a onClick={() => applyFilter()}>No Filter</a>
          </li>
          <li>
            <a onClick={() => applyFilter("pending")}>
              Filter by status: Pending
            </a>
          </li>
          <li>
            <a onClick={() => applyFilter("in-progress")}>
              Filter by status: In-Progress
            </a>
          </li>
          <li>
            <a onClick={() => applyFilter("completed")}>
              Filter by status: Completed
            </a>
          </li>
        </ul>
      </div>
      <div className="pt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
        {tasks.map((task) => {
          const statusColor =
            task.status === "Completed"
              ? "text-green-500"
              : task.status === "In-Progress"
              ? "text-gray-500"
              : "text-red-500";

          return (
            <div key={task._id} className="w-full">
              <div className="group relative flex flex-row items-center justify-between rounded-lg bg-base-200 p-5 transition-transform duration-300 hover:scale-105 hover:shadow-lg sm:flex-col sm:items-start sm:p-4">
                <div className="w-full sm:w-auto text-left">
                  <button
                    onClick={() => router.push(`/task/${task._id}`)}
                    className="text-lg font-medium group-hover:underline block pr-2"
                  >
                    {task.title}
                  </button>
                  <span className={`${statusColor} font-semibold`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex space-x-2 sm:mt-3 sm:w-full sm:justify-end">
                  <button
                    onClick={() => router.push(`/task/edit/${task._id}`)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center pt-10 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`btn btn-sm ${page === index + 1 ? "btn-active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllTasks;
