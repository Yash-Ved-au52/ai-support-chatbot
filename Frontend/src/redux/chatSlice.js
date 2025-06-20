import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  loading: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { addMessage, setLoading } = chatSlice.actions;
export default chatSlice.reducer;
