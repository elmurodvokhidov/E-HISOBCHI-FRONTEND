import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import teacherSlice from "../slices/teacherSlice";
import studentSlice from "../slices/studentSlice";
import adminSlice from "../slices/adminSlice";
import noticeSlice from "../slices/noticeSlice";
import courseSlice from "../slices/courseSlice";
import roomSlice from "../slices/roomSlice";
import groupSlice from "../slices/groupSlice";
import leadSlice from "../slices/leadSlice";
import studentPayHistorySlice from "../slices/studentPayHistory";
import companySlice from "../slices/companySlice";
import costSlice from "../slices/costSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        teacher: teacherSlice,
        student: studentSlice,
        admin: adminSlice,
        notice: noticeSlice,
        course: courseSlice,
        room: roomSlice,
        group: groupSlice,
        lead: leadSlice,
        studentPayHistory: studentPayHistorySlice,
        company: companySlice,
        cost: costSlice,
    }
});