import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorage } from '../../storage';
import socket from '../../socket/socket';
import { handleEmitterAndUpdatedListsShared } from '../../socket/handleEmmitter';

export interface List {
  id: string;
  key: string;
  shared: boolean;
  owner: string;
  updated_at: string;
}

export interface Task {
  id: string;
  task: string;
  done: boolean;
  user: string;
  listId: string;
  priority: Priority;
  date?: Date;
  schedule: boolean;
  description: Description[];
  deleted: boolean;
}

export type Priority = 'Baixa' | 'Media' | 'Alta';

export type Description = {
  id: string;
  taskId: string;
  listId: string;
  type: 'input';
  details: string;
  title: string;
};

export interface IList {
  id: string;
  list: List;
  tasks: Task[];
}

const initialState: IList[] = [] as IList[];

const reducerSlice = createSlice({
  name: 'Tasks',
  initialState,
  reducers: {
    setReducer: (_, action: PayloadAction<IList[]>) => {
      return action.payload;
    },
    addListReducer: (state, action: PayloadAction<IList>) => {
      state.push(action.payload);
      localStorage.setStorage('content', state);
      return state;
    },
    editListReducer: (state, action: PayloadAction<IList>) => {
      const data = state.filter((list) => list.id !== action.payload.id);
      action.payload.list.updated_at = new Date().toISOString();
      data.unshift(action.payload);
      localStorage.setStorage('content', data);
      return data;
    },
    removeListReducer: (state, action: PayloadAction<IList>) => {
      const data = state.filter((list) => list.id !== action.payload.id);
      localStorage.setStorage('content', data);
      return data;
    },
    addTaskReducer: (state, action: PayloadAction<Task>) => {
      state.forEach((list) => {
        if (list.list.id === action.payload.listId) {
          list.list.updated_at = new Date().toISOString();
          list.tasks.push(action.payload);
        }
      });
      localStorage.setStorage('content', state);
      return state;
    },
    editTaskReducer: (state, action: PayloadAction<Task>) => {
      state.forEach((list) => {
        if (list.list.id === action.payload.listId) {
          const data = list.tasks.filter(
            (task) => task.id !== action.payload.id,
          );
          list.list.updated_at = new Date().toISOString();
          data.push(action.payload);
          list.tasks = data;
        }
      });
      localStorage.setStorage('content', state);
      return state;
    },
    editIndexTaskReducer: (state, action: PayloadAction<Task[]>) => {
      state.forEach((list) => {
        if (list.list.id === action.payload[0].listId) {
          list.tasks = action.payload;
        }
      });
      localStorage.setStorage('content', state);
      return state;
    },
    removeTasksReducer: (state, action: PayloadAction<Task>) => {
      state.forEach((list) => {
        if (list.list.id === action.payload.listId) {
          const data = list.tasks.filter(
            (task) => task.id !== action.payload.id,
          );
          list.list.updated_at = new Date().toISOString();
          list.tasks = data;
        }
      });
      localStorage.setStorage('content', state);
      return state;
    },
    addDescriptionReducer: (state, action: PayloadAction<Description>) => {
      state.forEach((list) => {
        if (list.list.id === action.payload.listId) {
          list.tasks.forEach((task) => {
            if (task.id === action.payload.taskId) {
              task.description.push(action.payload);
              list.list.updated_at = new Date().toISOString();
            }
          });
        }
      });
      localStorage.setStorage('content', state);
      return state;
    },
    editDescriptionReducer: (state, action: PayloadAction<Description>) => {
      state.forEach((list) => {
        if (list.list.id === action.payload.listId) {
          list.tasks.forEach((task) => {
            if (task.id === action.payload.taskId) {
              const data = task.description.filter(
                (desc) => desc.id !== action.payload.id,
              );
              data.push(action.payload);
              task.description = data;
              list.list.updated_at = new Date().toISOString();
            }
          });
        }
      });
      localStorage.setStorage('content', state);
      return state;
    },
    removeDescriptionReducer: (state, action: PayloadAction<Description>) => {
      state.forEach((list) => {
        if (list.list.id === action.payload.listId) {
          list.tasks.forEach((task) => {
            if (task.id === action.payload.taskId) {
              const data = task.description.filter(
                (desc) => desc.id !== action.payload.id,
              );
              task.description = data;
              list.list.updated_at = new Date().toISOString();
            }
          });
        }
      });
      localStorage.setStorage('content', state);
      return state;
    },
    clear: () => {
      return initialState;
    },
  },
});

export const {
  setReducer,
  addListReducer,
  editListReducer,
  removeListReducer,
  addTaskReducer,
  editTaskReducer,
  editIndexTaskReducer,
  removeTasksReducer,
  addDescriptionReducer,
  editDescriptionReducer,
  removeDescriptionReducer,
  clear,
} = reducerSlice.actions;

export default reducerSlice.reducer;
