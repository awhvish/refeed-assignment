"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { updateTask, getAllTasks } from "@/slices/taskSlice";
import { RootState, AppDispatch } from "@/utils/store";

// Define a Task interface to match your state
interface Task {
  _id: string;
  title?: string;
  description?: string;
  status?: string;
}

const EditTask = () => {
  // Get the dynamic route parameter
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Extract the tasks list and status from the Redux store
  const { list, status: tasksStatus } = useSelector(
    (state: RootState) => state.tasks
  );

  // Find the task from the list using the id from the URL
  const task = list.find((task: Task) => task._id === id);

  // Local state for the form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  // If the tasks list is empty and we're in the "idle" state, fetch the tasks.
  useEffect(() => {
    if (list.length === 0 && tasksStatus === "idle") {
      dispatch(getAllTasks({}));
    }
  }, [list, tasksStatus, dispatch]);

  // Populate local state when the task becomes available.
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "Pending");
    }
  }, [task]);

  // Handle the form submission.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof id === "string") {
      dispatch(updateTask({ _id: id, title, description, status }));
    }
    router.push("/");
  };

  // Display a loading indicator while tasks are being fetched.
  if (tasksStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Once tasks have been fetched, if the task is still not found, show a "not found" message.
  if (tasksStatus === "succeeded" && !task) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Task not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <header className="text-3xl font-semibold py-4 text-center">
        Edit Task
      </header>

      <div className="w-full max-w-md bg-base-200 p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-1">Status</label>
            <select
              className="select select-bordered w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full hover:shadow-md"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
