import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    studentPayHistory: [],
    isError: null
}

const studentPayHistorySlice = createSlice({
    name: "lead",
    initialState,
    reducers: {
        studentPayHistoryStart: (state) => {
            state.isLoading = true;
        },
        allStudentPayHistorySuccess: (state, action) => {
            state.isLoading = false;
            state.studentPayHistory = action.payload?.data;
        },
        studentPayHistoryFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    studentPayHistoryStart,
    allStudentPayHistorySuccess,
    studentPayHistoryFailure,
} = studentPayHistorySlice.actions;
export default studentPayHistorySlice.reducer;