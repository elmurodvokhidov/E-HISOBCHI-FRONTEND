import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    rooms: [],
    isError: null
}

const RoomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        roomStart: (state) => {
            state.isLoading = true;
        },
        allRoomSuccess: (state, action) => {
            state.isLoading = false;
            state.rooms = action.payload?.data;
        },
        roomFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    roomStart,
    allRoomSuccess,
    roomFailure,
} = RoomSlice.actions;
export default RoomSlice.reducer;