import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    student: null,
    students: [],
    isError: null
}

const StudentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        studentStart: (state) => {
            state.isLoading = true;
        },
        getStudentSuccess: (state, action) => {
            state.isLoading = false;
            state.student = action.payload?.data;
        },
        allStudentSuccess: (state, action) => {
            state.isLoading = false;
            state.students = action.payload?.data;
        },
        studentFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    studentStart,
    getStudentSuccess,
    allStudentSuccess,
    studentFailure,
} = StudentSlice.actions;
export default StudentSlice.reducer;