import { createSlice } from "@reduxjs/toolkit";
import { deleteAllCookies } from "../../config/cookiesService";

const initialState = {
    isLoading: false,
    isLoggedIn: false,
    auth: null,
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
            state.isLoggedIn = true;
            state.auth = action.payload?.data;
        },
        authFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
        authLogout: (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.auth = null;
            deleteAllCookies();
        }
    }
});

export const {
    authStart,
    authSuccess,
    authFailure,
    authLogout
} = AuthSlice.actions;
export default AuthSlice.reducer;