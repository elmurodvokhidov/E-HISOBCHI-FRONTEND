import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    costs: [],
    isError: null
}

const costSlice = createSlice({
    name: "cost",
    initialState,
    reducers: {
        costStart: (state) => {
            state.isLoading = true;
        },
        costSuccess: (state, action) => {
            state.isLoading = false;
            state.costs = action.payload?.data;
        },
        costFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    costStart,
    costSuccess,
    costFailure,
} = costSlice.actions;
export default costSlice.reducer;