import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    notice: null,
    notices: null,
    isError: null
}

const NoticeSlice = createSlice({
    name: "notice",
    initialState,
    reducers: {
        noticeStart: (state) => {
            state.isLoading = true;
        },
        getNoticeSuccess: (state, action) => {
            state.isLoading = false;
            state.notice = action.payload?.data;
        },
        newNoticeSuccess: (state, action) => {
            state.isLoading = false;
            state.notices.push(action.payload?.data);
        },
        allNoticeSuccess: (state, action) => {
            state.isLoading = false;
            state.notices = action.payload?.data;
            state.notice = null;
        },
        noticeFailure: (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        },
    }
});

export const {
    noticeStart,
    getNoticeSuccess,
    newNoticeSuccess,
    allNoticeSuccess,
    noticeFailure,
} = NoticeSlice.actions;
export default NoticeSlice.reducer;