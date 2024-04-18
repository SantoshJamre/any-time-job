import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: {
    isAuthenticated: false,
  },
  user: {},
}


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, userData) => {
      state.state.isAuthenticated = true;
      state.user = userData;
    },
    removeUser: (state) => {
      state.state.isAuthenticated = false;
      state.user = {};
    },
  }
});

export const {
  setUser,
  removeUser
} = userSlice.actions;


export default userSlice.reducer;