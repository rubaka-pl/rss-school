import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SelectedItem } from '../types/app';
import type { State } from '../types/app';

const initialState: State = {
  items: {},
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<SelectedItem>) => {
      const { id } = action.payload;

      if (state.items[id]) {
        const rest = Object.fromEntries(
          Object.entries(state.items).filter(([key]) => key !== id)
        );
        state.items = rest;
      } else {
        state.items[id] = action.payload;
      }
    },
    clearSelection: (state) => {
      state.items = {};
    },
  },
});

export const { toggleItem, clearSelection } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
