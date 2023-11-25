import { configureStore } from '@reduxjs/toolkit';
import taskListReducer from '../store/ITaskList/reducer';

export const store = configureStore({
  reducer: {
    ITaskList: taskListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
