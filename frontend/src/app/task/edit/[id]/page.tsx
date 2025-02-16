interface Params {
  id: string;
}

const EditTask = ({ params }: { params: Params }) => {
  const { id } = params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Header */}
      <header className="text-3xl font-semibold py-4 text-center">
        Edit Task #{id}
      </header>

      {/* Input Form */}
      <div className="w-full max-w-md bg-base-200 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-lg font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter task title..."
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-1">Description</label>
          <textarea
            placeholder="Enter task description..."
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-1">Status</label>
          <select
            className="select select-bordered w-full"
            defaultValue="Pending"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button className="btn btn-primary w-full hover:shadow-md">
          Update Task
        </button>
      </div>
    </div>
  );
};

export default EditTask;
