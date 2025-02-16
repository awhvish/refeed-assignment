const AllTasks = () => {
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
  ];

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-center text-2xl font-semibold py-4">
        All your current tasks:
      </header>

      {/* Task List */}
      <div className="pt-10 px-32 space-y-4">
        {tasks.map((task, index) => {
          // Corrected status color classes
          const statusColor =
            task.status === "Completed"
              ? "text-green-500"
              : task.status === "In Progress"
              ? "text-gray-500"
              : "text-red-500"; // Default to red for any other status

          return (
            <div key={index}>
              {/* Task Card */}
              <div className="group relative flex items-center justify-between rounded-lg bg-base-200 p-5 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                {/* Task Title and Status */}
                <div>
                  <a
                    href={`/task/${task.id}`}
                    className="text-lg font-medium group-hover:underline pr-2"
                  >
                    {task.title}
                  </a>
                  |{" "}
                  <span className={`${statusColor} font-semibold`}>
                    {task.status}
                  </span>
                </div>

                {/* Buttons Wrapper (Right-Aligned) */}
                <div className="flex space-x-4">
                  <button className="btn btn-outline">Edit</button>
                  <button className="btn btn-outline btn-error">Delete</button>
                </div>
              </div>

              {/* Divider */}
              <div className="divider"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTasks;
