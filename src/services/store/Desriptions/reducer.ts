import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorage } from '../../storage';
import { Description } from '../Tasks/reducer';

const initialState: Description[] = [] as Description[];

const DescriptionsSlice = createSlice({
  name: 'Descriptions',
  initialState,
  reducers: {
    setDescriptions: (_, action: PayloadAction<Description[]>) => {
      return action.payload;
    },
    addDescription: (state, action: PayloadAction<Description>) => {
      state.push(action.payload);
      localStorage.setStorage('desc', state);
      return state;
    },
    editDescription: (state, action: PayloadAction<Description>) => {
      const data = state.filter((desc) => desc.id !== action.payload.id);
      data.push(action.payload);
      localStorage.setStorage('desc', state);
      return data;
    },
    removeDescription: (state, action: PayloadAction<Description>) => {
      const data = state.filter((desc) => desc.id !== action.payload.id);
      localStorage.setStorage('desc', data);
      return data;
    },
    clearDescription: () => {
      return initialState;
    },
  },
});

export const {
  setDescriptions,
  addDescription,
  editDescription,
  removeDescription,
  clearDescription,
} = DescriptionsSlice.actions;

export default DescriptionsSlice.reducer;
