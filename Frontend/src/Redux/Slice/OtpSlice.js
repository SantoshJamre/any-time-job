import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    state: {
        isOtpVerified: false,
    }
}


const otpSlice = createSlice({
    name: "verifyOtp",
    initialState,
    reducers: {
        verifyOtp: (state, action) => {
            state.state.isOtpVerified = action.payload;
        }
    }
});

export const {
    verifyOtp,
} = otpSlice.actions;


export default otpSlice.reducer;