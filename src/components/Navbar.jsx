import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import LoaderDots from "./loaders/LoaderDots";
import { allNoticeSuccess, noticeFailure, noticeStart } from "../redux/slices/noticeSlice";
import AuthService from "../config/authService";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { authLogout, authStart } from "../redux/slices/authSlice";
import { IoMenuOutline } from "react-icons/io5";
import { getCookie } from "../config/cookiesService";
import { companySuccess } from "../redux/slices/companySlice";

function Navbar({ modals, handleModal }) {
    const { auth } = useSelector(state => state.auth);
    const { company } = useSelector(state => state.company);
    const { notices } = useSelector(state => state.notice);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);

    const notification = notices?.filter(notice => notice.author?.first_name !== auth?.first_name);
    const teacher = notices?.filter(notice => notice.to === "teacher");
    const student = notices?.filter(notice => notice.to === "student");

    const huru = getCookie("x-auth");

    function GlobalElement() {
        switch (huru) {
            case "admin":
                return <>
                    <Link to="/admin/notice" className="relative">
                        <FaBell />
                        <span className="flex size-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-xs text-white bg-cyan-600">{notification?.length}</span>
                    </Link>
                </>
            case "teacher":
                return <>
                    <Link to="/teacher/notice" className="relative">
                        <FaBell />
                        <span className="flex size-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-xs text-white bg-cyan-600">{teacher?.length}</span>
                    </Link>
                </>
            case "student":
                return <>
                    <Link to="/student/notice" className="relative">
                        <FaBell />
                        <span className="flex size-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-xs text-white bg-cyan-600">{student?.length}</span>
                    </Link>
                </>
            default:
                return <>
                    <Link to="/" className="relative">
                        <FaBell />
                        <span className="flex size-[18px] rounded-full items-center justify-center absolute -top-3 -right-2 text-xs text-white bg-cyan-600">0</span>
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

    const getCompanyFunction = async () => {
        try {
            const { data } = await AuthService.getCompany();
            dispatch(companySuccess(data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNotices();
        getCompanyFunction();
    }, [notices?.length]);

    const logoutHandler = () => {
        dispatch(authStart());
        dispatch(authLogout());
        navigate("/");
    };

    return (
        <div className="w-full fixed z-20 top-0 flex items-center justify-between py-2 px-10 shadow-dim bg-white">
            <div className="logo w-14 pc:w-16">
                <Link to="dashboard" className="md:inline-block hidden"><img crossOrigin="anonymous" src={company?.image} alt="company logo" /></Link>
                <IoMenuOutline
                    onClick={(e) => {
                        e.stopPropagation();
                        handleModal("sideModal", !modals.sideModal);
                        handleModal("settingsModal", false);
                        handleModal("financeModal", false);
                    }}
                    className="md:hidden text-3xl text-gray-500" />
            </div>

            {huru === "admin" && <SearchBar modals={modals} handleModal={handleModal} />}

            <div className="right flex relative items-center gap-4 text-gray-500">
                {/* <GlobalElement /> */}
                <button
                    onClick={() => setModal(!modal)}
                    className="flex items-center gap-2">
                    <span className="md:inline-block hidden text-base pc:text-lg text-black">{auth ? auth.first_name : <LoaderDots />}</span>
                    <figure className="size-8 pc:size-11 2xl:size-9 rounded-full overflow-hidden flex items-center justify-center">
                        {
                            auth &&
                                auth.avatar && auth.avatar !== "" ?
                                <img className="w-full h-full object-cover" src={auth.avatar} alt="auth avatar" /> :
                                <IoPersonCircleOutline className="w-full h-full text-gray-500" />
                        }
                    </figure>
                </button>
                {
                    modal &&
                    <div
                        onClick={() => setModal(false)}
                        className="fixed top-0 left-0 bottom-0 right-0">
                        <div className="w-40 flex flex-col items-start justify-start absolute z-10 sm:top-16 small:top-12 pc:top-20 right-10 text-black text-xs pc:text-sm rounded border border-gray-300 bg-white">
                            <Link
                                to="profile"
                                className="w-full p-4 border-b border-gray-300 hover:bg-gray-100">Hisob qaydnomasi</Link>
                            <button
                                onClick={logoutHandler}
                                className="w-full p-4 text-left hover:bg-gray-100">Chiqish</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar