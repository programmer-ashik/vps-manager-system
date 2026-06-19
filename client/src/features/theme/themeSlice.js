import { createSlice } from '@reduxjs/toolkit';
import { loadJSON, saveJSON } from '../../utils/storage';

const KEY = 'theme';
const initial = loadJSON(KEY) ?? { mode: 'light', accent: 'blue' };

const slice = createSlice({
  name: 'theme',
  initialState: initial,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      saveJSON(KEY, state);
    },
    setAccent(state, { payload }) {
      state.accent = payload; // 'blue'|'emerald'|'violet'
      saveJSON(KEY, state);
    },
  },
});

export const { toggleMode, setAccent } = slice.actions;
export default slice.reducer;

