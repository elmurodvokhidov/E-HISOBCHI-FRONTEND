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
        newStudentSuccess: (state, action) => {
            state.isLoading = false;
            console.log(action.payload);
            state.students.push(action.payload?.data);
        },
        allStudentSuccess: (state, action) => {
            state.isLoading = false;
            state.students = action.payload?.data;
            state.student = null;
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
    newStudentSuccess,
    allStudentSuccess,
    studentFailure,
} = StudentSlice.actions;
export default StudentSlice.reducer;