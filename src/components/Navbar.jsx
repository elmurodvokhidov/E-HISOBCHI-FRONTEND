import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import logo from "../img/uitc_logo.png"
import LoaderDots from "./loaders/LoaderDots";
import { allNoticeSuccess, noticeFailure, noticeStart } from "../redux/slices/noticeSlice";
import AuthService from "../config/authService";
import { useEffect } from "react";

function Navbar() {
    const { auth } = useSelector(state => state.auth);
    const { notices } = useSelector(state => state.notice);
    const dispatch = useDispatch();

    const notification = notices?.filter(notice => notice.author.first_name !== auth?.first_name);
    const teacher = notices?.filter(notice => notice.to === "teacher");
    const student = notices?.filter(notice => notice.to === "student");

    const huru = localStorage.getItem("x-auth");

    function GlobalElement() {
        switch (huru) {
            case "admin":
                return <>
                    <Link to="/admin/notice" className="relative">
                        <FaBell />
                        <span className="flex w-[18px] h-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-[12px] text-white bg-cyan-600">{notification?.length}</span>
                    </Link>
                </>
            case "teacher":
                return <>
                    <Link to="/teacher/notice" className="relative">
                        <FaBell />
                        <span className="flex w-[18px] h-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-[12px] text-white bg-cyan-600">{teacher?.length}</span>
                    </Link>
                </>
            case "student":
                return <>
                    <Link to="/student/notice" className="relative">
                        <FaBell />
                        <span className="flex w-[18px] h-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-[12px] text-white bg-cyan-600">{student?.length}</span>
                    </Link>
                </>
            default:
                return <>
                    <Link to="/" className="relative">
                        <FaBell />
                        <span className="flex w-[18px] h-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-[12px] text-white bg-cyan-600">0</span>
                    </Link>
                </>
        }
    }

    const getNotices = async () => {
        try {
            dispatch(noticeStart());
            const { data } = await AuthService.getAllNotices();
            dispatch(allNoticeSuccess(data));
        } catch (error) {
            dispatch(noticeFailure(error.message));
        }
    };

    useEffect(() => {
        getNotices();
    }, [notices?.length]);

    return (
        <div className="w-full fixed z-10 top-0 flex items-center justify-between py-2 px-10 shadow-dim font-montserrat bg-white">
            <div className="logo w-14">
                <Link to="dashboard"><img src={logo} alt="logo" /></Link>
            </div>

            <div className="right flex items-center gap-4 text-gray-500">
                <GlobalElement />
                <Link to="profile" className="flex items-center gap-2">
                    <span className="text-[16px] text-black">{auth ? auth?.first_name : <LoaderDots />}</span>
                    <IoPersonCircleOutline className="text-3xl" />
                </Link>
            </div>
        </div>
    )
}

export default Navbar