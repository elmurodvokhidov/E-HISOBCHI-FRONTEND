import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    teacher: null,
    teachers: [],
    isError: null
}

const TeacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {
        teacherStart: (state) => {
            state.isLoading = true;
        },
        getTeacherSuccess: (state, action) => {
            state.isLoading = false;
            state.teacher = action.payload?.data;
        },
        allTeacherSuccess: (state, action) => {
            state.isLoading = false;
            state.teachers = action.payload?.data;
        },
        teacherFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    teacherStart,
    getTeacherSuccess,
    allTeacherSuccess,
    teacherFailure,
} = TeacherSlice.actions;
export default TeacherSlice.reducer;