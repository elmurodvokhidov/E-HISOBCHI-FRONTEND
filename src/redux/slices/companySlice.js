import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    company: null,
    isError: null
}

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        companyStart: (state) => {
            state.isLoading = true;
        },
        companySuccess: (state, action) => {
            state.isLoading = false;
            state.company = action.payload?.data;
        },
        companyFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    companyStart,
    companySuccess,
    companyFailure,
} = companySlice.actions;
export default companySlice.reducer;