import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import LoaderDots from "./loaders/LoaderDots";
import { allNoticeSuccess, noticeFailure, noticeStart } from "../redux/slices/noticeSlice";
import service from "../config/service";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { authLogout, authStart } from "../redux/slices/authSlice";
import { IoMenuOutline } from "react-icons/io5";
import { companySuccess } from "../redux/slices/companySlice";
import logo from "../assets/images/UITC 1.png";

function Navbar({ modals, handleModal }) {
    const { auth } = useSelector(state => state.auth);
    const { notices } = useSelector(state => state.notice);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);

    const getNotices = async () => {
        try {
            dispatch(noticeStart());
            const { data } = await service.getAllNotices();
            dispatch(allNoticeSuccess(data));
        } catch (error) {
            dispatch(noticeFailure(error.message));
        }
    };

    const getCompanyFunction = async () => {
        try {
            const { data } = await service.getCompany();
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
        navigate("/login");
    };

    return (
        <div className="w-full fixed z-20 top-0 flex items-center justify-between py-2 px-10 shadow-dim bg-white">
            <div className="logo w-14 pc:w-16">
                <Link to="dashboard" className="md:inline-block hidden">
                    <img
                        crossOrigin="anonymous"
                        src={logo}
                        alt="company logo"

                    />

                </Link>
                <IoMenuOutline
                    onClick={(e) => {
                        e.stopPropagation();
                        handleModal("sideModal", !modals.sideModal);
                        handleModal("settingsModal", false);
                        handleModal("financeModal", false);
                    }}
                    className="md:hidden text-3xl text-gray-500" />
            </div>

            <SearchBar
                modals={modals}
                handleModal={handleModal}
            />

            <div className="right flex relative items-center gap-4 text-gray-500">
                <button
                    onClick={() => setModal(!modal)}
                    className="flex items-center gap-2">
                    <span className="md:inline-block hidden text-base pc:text-lg text-black">
                        {auth ? auth?.first_name : <LoaderDots />}
                    </span>
                    <figure className="size-8 pc:size-11 2xl:size-9 rounded-full overflow-hidden flex items-center justify-center">
                        <img className="w-full h-full object-cover" src={auth?.avatar} alt="auth avatar" />
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
                                className="w-full p-4 border-b border-gray-300 hover:bg-gray-100">
                                Hisob qaydnomasi
                            </Link>
                            <button
                                onClick={logoutHandler}
                                className="w-full p-4 text-left hover:bg-gray-100">
                                Chiqish
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar