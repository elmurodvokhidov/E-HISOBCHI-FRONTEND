import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    course: null,
    courses: [],
    isError: null
}

const CourseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        courseStart: (state) => {
            state.isLoading = true;
        },
        getCourseSuccess: (state, action) => {
            state.isLoading = false;
            state.course = action.payload?.data;
        },
        newCourseSuccess: (state, action) => {
            state.isLoading = false;
            state.courses.push(action.payload?.data);
        },
        allCourseSuccess: (state, action) => {
            state.isLoading = false;
            state.courses = action.payload?.data;
            state.course = null;
        },
        courseFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    courseStart,
    getCourseSuccess,
    newCourseSuccess,
    allCourseSuccess,
    courseFailure,
} = CourseSlice.actions;
export default CourseSlice.reducer;