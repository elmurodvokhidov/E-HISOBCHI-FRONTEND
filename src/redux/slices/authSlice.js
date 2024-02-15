import { createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage } from "../../config/localStorageService";

const initialState = {
    isLoading: false,
    isLogin: false,
    user: null,
    teachers: null,
    students: null,
    isError: null
}

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authStart: (state) => {
            state.isLoading = true;
        },
        authSuccess: (state, action) => {
            state.isLoading = false;
            state.isLogin = true;
            state.user = action.payload?.data;
            saveToLocalStorage("x-id", action.payload?.data._id);
        },
        authFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
        authLogout: (state) => {
            state.isLoading = false;
            state.isLogin = false;
            state.user = null;
            localStorage.clear();
        },


        // teacher
        teacherStart: (state) => {
            state.isLoading = true;
        },
        teacherSuccess: (state, action) => {
            state.isLoading = false;
            state.isLogin = true;
            state.teachers = action.payload?.data;
        },
        newTeacherSuccess: (state, action) => {
            state.isLoading = false;
            state.isLogin = true;
            state.teachers.push(action.payload?.data);
        },
        teacherFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    authStart,
    authSuccess,
    authFailure,
    authLogout,

    // teacher
    teacherStart,
    teacherSuccess,
    newTeacherSuccess,
    teacherFailure,
} = AuthSlice.actions;
export default AuthSlice.reducer;