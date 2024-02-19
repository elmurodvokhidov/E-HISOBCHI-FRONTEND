import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    admin: null,
    admins: null,
    isError: null
}

const AdminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminStart: (state) => {
            state.isLoading = true;
        },
        getAdminSuccess: (state, action) => {
            state.isLoading = false;
            state.admin = action.payload?.data;
        },
        newAdminSuccess: (state, action) => {
            state.isLoading = false;
            state.admins.push(action.payload?.data);
        },
        allAdminSuccess: (state, action) => {
            state.isLoading = false;
            state.admins = action.payload?.data;
            state.admin = null;
        },
        adminFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    adminStart,
    getAdminSuccess,
    newAdminSuccess,
    allAdminSuccess,
    adminFailure,
} = AdminSlice.actions;
export default AdminSlice.reducer;