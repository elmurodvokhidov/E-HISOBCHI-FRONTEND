import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    lead: null,
    leads: [],
    isError: null
}

const leadSlice = createSlice({
    name: "lead",
    initialState,
    reducers: {
        leadStart: (state) => {
            state.isLoading = true;
        },
        getLeadSuccess: (state, action) => {
            state.isLoading = false;
            state.lead = action.payload?.data;
        },
        allLeadSuccess: (state, action) => {
            state.isLoading = false;
            state.leads = action.payload?.data;
            state.lead = null;
        },
        leadFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    leadStart,
    getLeadSuccess,
    allLeadSuccess,
    leadFailure,
} = leadSlice.actions;
export default leadSlice.reducer;