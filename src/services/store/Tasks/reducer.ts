import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorage } from '../../storage';

export interface Task {
  id: string;
  task: string;
  done: boolean;
  listId: string;
  priority: Priority;
  date?: Date;
  schedule: boolean;
  description?: Description[];
  updated_at: string;
}

export type Priority = 'Baixa' | 'Media' | 'Alta';

export type Description = {
  id: string;
  taskId: string;
  type: 'input';
  details: string;
  title: string;
};

const initialState: Task[] = [] as Task[];

const tasksSlice = createSlice({
  name: 'Tasks',
  initialState,
  reducers: {
    setTasks: (_, action: PayloadAction<Task[]>) => {
      return action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
      localStorage.setStorage('tasks', state);
      return state;
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const data = state.filter((task) => task.id !== action.payload.id);
      data.push(action.payload);
      localStorage.setStorage('tasks', state);
      return data;
    },
    editIndexTask: (state, action: PayloadAction<Task[]>) => {
      const data: Task[] = [
        ...state.filter((t) => !action.payload.some((ta) => ta.id === t.id)),
        ...action.payload,
      ];

      localStorage.setStorage('tasks', data);
      return data;
    },
    removeTasks: (state, action: PayloadAction<Task>) => {
      const data = state.filter((task) => task.id !== action.payload.id);
      localStorage.setStorage('tasks', data);
      return data;
    },
    clear: () => {
      return initialState;
    },
  },
});

export const {
  setTasks,
  addTask,
  editTask,
  editIndexTask,
  removeTasks,
  clear,
} = tasksSlice.actions;

export default tasksSlice.reducer;
