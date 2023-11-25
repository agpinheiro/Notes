import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorage } from '../../storage';

export interface List {
  id: string;
  key: string;
  shared: boolean;
}

const initialState: List[] = [] as List[];

const listsSlice = createSlice({
  name: 'Lists',
  initialState,
  reducers: {
    setLists: (_, action: PayloadAction<List[]>) => {
      return action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.push(action.payload);
      localStorage.setStorage('lists', state);
      return state;
    },
    editList: (state, action: PayloadAction<List>) => {
      const data = state.filter((list) => list.id !== action.payload.id);
      data.push(action.payload);
      localStorage.setStorage('lists', state);
      return data;
    },
    removeList: (state, action: PayloadAction<List>) => {
      const data = state.filter((list) => list.id !== action.payload.id);
      localStorage.setStorage('lists', data);
      return data;
    },
    clearList: () => {
      return initialState;
    },
  },
});

export const { setLists, addList, editList, removeList, clearList } =
  listsSlice.actions;

export default listsSlice.reducer;
