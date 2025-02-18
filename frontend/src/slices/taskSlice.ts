import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

// Define the Task interface
interface Task {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
}

interface TaskGetAll {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllTasks = createAsyncThunk(
  "tasks/getAllTasks",
  async (params: TaskGetAll) => {
    const { page = 1, limit = 6, search = "" } = params;
    console.log("Fetching tasks with:", { page, limit, search });

    const response = await axiosInstance.get("/tasks", {
      params: { page, limit, search },
    });
    return response.data.tasks;
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Task) => {
    const response = await axiosInstance.post("/tasks", task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        status: task.status,
      });
      console.log("Update response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await axiosInstance.delete(`/tasks/${taskId}`);
    return taskId;
  }
);

// Task Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [] as Task[],
    selectedTask: null as Task | null,
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(getAllTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Update Task – Using _id for matching
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export const { setSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
