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
        // newTeacherSuccess: (state, action) => {
        //     state.isLoading = false;
        //     state.teachers = [...state.teachers, action.payload?.data];
        // },
        allTeacherSuccess: (state, action) => {
            state.isLoading = false;
            state.teachers = action.payload?.data;
            state.teacher = null;
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
    // newTeacherSuccess,
    allTeacherSuccess,
    teacherFailure,
} = TeacherSlice.actions;
export default TeacherSlice.reducer;