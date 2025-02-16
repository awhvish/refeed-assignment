import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full">
      <div className="navbar bg-base-100 p-4 md:p-6 flex-wrap">
        {/* Logo Section */}
        <div className="flex-1">
          <a className="btn btn-ghost text-lg md:text-xl">Task-App</a>
        </div>

        {/* Search & Add Task Section */}
        <div className="flex items-center gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search Tasks"
              className="input input-bordered w-20 sm:w-32 md:w-auto"
            />
          </div>

          {/* Add Task Button */}
          <div className="navbar-end">
            <Link
              className="btn btn-sm sm:btn-md flex items-center gap-2"
              href="/task/new"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">Add Task</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
