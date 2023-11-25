import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../store/Tasks/reducer';
import listsReducer from '../store/List/reducer';
import descriptionReducer from '../store/Desriptions/reducer';

export const store = configureStore({
  reducer: {
    Tasks: taskReducer,
    Lists: listsReducer,
    Description: descriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
