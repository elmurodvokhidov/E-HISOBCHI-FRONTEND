import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import teacherSlice from "../slices/teacherSlice";
import studentSlice from "../slices/studentSlice";
import adminSlice from "../slices/adminSlice";
import noticeSlice from "../slices/noticeSlice";
import courseSlice from "../slices/courseSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        teacher: teacherSlice,
        student: studentSlice,
        admin: adminSlice,
        notice: noticeSlice,
        course: courseSlice,
    }
});