import React from "react";

const Navbar = () => {
  return (
    <div className="">
      <div className="navbar bg-base-100 p-10">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Task Management</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search Tasks"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <div className="navbar-end pl-5">
            <a className="btn">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>{" "}
              Add Task
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
