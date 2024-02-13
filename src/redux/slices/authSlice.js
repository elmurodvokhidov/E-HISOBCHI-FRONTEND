import { createSlice } from "@reduxjs/toolkit";
import { rmFromLocalStorage, saveToLocalStorage } from "../../config/localStorageService";

const initialState = {
    isLoading: false,
    isLogin: false,
    user: null,
    isError: null
}

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authStart: (state, action) => {
            state.isLoading = true;
        },
        authSuccess: (state, action) => {
            state.isLoading = false;
            state.isLogin = true;
            state.user = action.payload.data;
            saveToLocalStorage("x-id", action.payload.data._id);
        },
        authFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
        authLogout: (state, action) => {
            state.isLoading = false;
            state.isLogin = false;
            rmFromLocalStorage("x-token");
        }
    }
});

export const {
    authStart,
    authSuccess,
    authFailure,
    authLogout,
} = AuthSlice.actions;
export default AuthSlice.reducer;