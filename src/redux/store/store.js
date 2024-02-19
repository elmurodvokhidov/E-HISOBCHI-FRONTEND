import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import teacherSlice from "../slices/teacherSlice";
import studentSlice from "../slices/studentSlice";
import adminSlice from "../slices/adminSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        teacher: teacherSlice,
        student: studentSlice,
        admin: adminSlice,
    }
});