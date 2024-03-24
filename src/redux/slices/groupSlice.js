import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    group: null,
    groups: [],
    isError: null
}

const GroupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        groupStart: (state) => {
            state.isLoading = true;
        },
        getGroupSuccess: (state, action) => {
            state.isLoading = false;
            state.group = action.payload?.data;
        },
        allGroupSuccess: (state, action) => {
            state.isLoading = false;
            state.groups = action.payload?.data;
            state.group = null;
        },
        groupFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    groupStart,
    getGroupSuccess,
    allGroupSuccess,
    groupFailure,
} = GroupSlice.actions;
export default GroupSlice.reducer;