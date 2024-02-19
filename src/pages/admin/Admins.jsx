import { useDispatch, useSelector } from "react-redux"
import { adminFailure, adminStart, allAdminSuccess } from "../../redux/slices/adminSlice";
import AuthService from "../../config/authService";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

function Admins() {
    const { admins } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    const getAllAdmins = async () => {
        dispatch(adminStart());
        try {
            const { data } = await AuthService.getAllAdmin();
            dispatch(allAdminSuccess(data));
        } catch (error) {
            dispatch(adminFailure(error.message));
        }
    };

    useEffect(() => {
        getAllAdmins();
    }, []);

    return (
        <div className="admins w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Admins</h1>
                    <p>Total <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{admins?.length}</span></p>
                </div>
                <button className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Add new admin</button>
            </div>

            <ul role="list" className="mt-4 divide-y divide-gray-100">
                {
                    admins ?
                        admins.map((admin, index) => (
                            <li className="flex justify-between gap-x-6 py-5" key={index}>
                                <div className="flex min-w-0 gap-x-4">
                                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg" alt="" />
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold capitalize leading-6 text-gray-900 hover:text-cyan-600 transition-all"><NavLink to={`/admin/admin-info/${admin._id}`}>{admin.first_name} {admin.last_name}</NavLink></p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{admin.email}</p>
                                    </div>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <p className="text-sm leading-6 text-gray-900">Adminstartor</p>
                                    <p className="mt-1 text-xs leading-5 text-gray-500">Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time></p>
                                </div>
                            </li>
                        )) :
                        <>
                            <div className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                                <div className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</div>
                                <div className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</div>
                                <div className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</div>
                            </div>
                        </>
                }
            </ul>

        </div>
    )
}

export default Admins