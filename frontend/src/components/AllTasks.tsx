"use client";

import { useRouter } from "next/navigation";

const AllTasks = () => {
  const router = useRouter();

  const handleDelete = (id: number) => {};

  const tasks = [
    {
      id: 1,
      title: "Work on task-app",
      description: "Create a task-app using Next.js and TailwindCSS.",
      status: "Completed",
    },
    {
      id: 2,
      title: "Work on chocolate-app",
      description: "Create a chocolate-app using SexUI and TailwindPorn.",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Work on sex-app",
      description: "Create a sex-app using ChocolateUI and TailwindCar.",
      status: "Pending",
    },
    {
      id: 4,
      title: "Work on task-app",
      description: "Create a task-app using Next.js and TailwindCSS.",
      status: "Completed",
    },
  ];

  return (
    <div className="px-16 xl:px-24">
      {/* Header */}
      <header className="flex items-center justify-center text-2xl font-semibold py-4">
        All your current tasks:
      </header>

      {/* Task List */}
      <div className="pt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
        {tasks.map((task) => {
          const statusColor =
            task.status === "Completed"
              ? "text-green-500"
              : task.status === "In Progress"
              ? "text-gray-500"
              : "text-red-500";

          return (
            <div key={task.id} className="w-full">
              {/* Task Card */}
              <div className="group relative flex flex-row items-center justify-between rounded-lg bg-base-200 p-5 transition-transform duration-300 hover:scale-105 hover:shadow-lg sm:flex-col sm:items-start sm:p-4">
                {/* Task Title and Status */}
                <div className="w-full sm:w-auto text-left">
                  <a
                    href={`/task/${task.id}`}
                    className="text-lg font-medium group-hover:underline block pr-2"
                  >
                    {task.title}
                  </a>
                  <span className={`${statusColor} font-semibold`}>
                    {" "}
                    {task.status}
                  </span>
                </div>

                {/* Buttons Wrapper (Right-Aligned) */}
                <div className="flex space-x-2 sm:mt-3 sm:w-full sm:justify-end">
                  <button
                    onClick={() => {
                      router.push(`/task/edit/${task.id}`);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
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

      {/* Pagination */}
      <div className="flex items-center justify-center pt-10 space-x-2">
        <button className="btn btn-sm">1</button>
        <button className="btn btn-sm btn-active">2</button>
        <button className="btn btn-sm">3</button>
        <button className="btn btn-sm">4</button>
      </div>
    </div>
  );
};

export default AllTasks;
