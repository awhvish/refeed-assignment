"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { getAllTasks, deleteTask } from "@/slices/taskSlice";
import { RootState, AppDispatch } from "@/utils/store";
import axiosInstance from "@/utils/axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const UniqueTaskPage = () => {
  // Ensure id is correctly extracted as a string
  const { id } = useParams() as { id: string };
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Extract tasks and status from Redux state
  const { list, status: tasksStatus } = useSelector(
    (state: RootState) => state.tasks
  );

  // Fetch tasks if not already loaded
  useEffect(() => {
    if (list.length === 0 && tasksStatus === "idle") {
      dispatch(getAllTasks({}));
    }
  }, [list, tasksStatus, dispatch]);

  // Find the specific task
  const task: Task | undefined = list.find((t: Task) => t._id === id);

  if (tasksStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (tasksStatus === "succeeded" && !task) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Task not found.
      </div>
    );
  }

  // Handle task deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axiosInstance.delete(`/tasks/${id}`);
      dispatch(deleteTask(id)); // Dispatch Redux action to update state
      router.push("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <header className="text-3xl font-semibold py-4 text-center">
        Task Details
      </header>

      <div className="w-full max-w-md bg-base-200 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{task?.title}</h2>
          <p className="mt-2">{task?.description}</p>
          <p className="mt-2">Status: {task?.status}</p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => router.push(`/task/edit/${id}`)}
            className="btn btn-outline btn-md"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-outline btn-error btn-md"
          >
            Delete
          </button>
          <button
            className="btn btn-outline btn-success btn-md"
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniqueTaskPage;
