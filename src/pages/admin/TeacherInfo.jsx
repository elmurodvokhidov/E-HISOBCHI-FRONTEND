import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { Toast } from "../../config/sweetToast";
import {
    getTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../../redux/slices/teacherSlice";
import logo from "../../img/uitc_logo.png";
import AuthService from "../../config/authService";
import TeacherEditModal from "../../components/TeacherEditModal";
import ProfileCardSkeleton from "../../components/ProfileCardSkeleton";

function TeacherInfo() {
    const { teacher } = useSelector(state => state.teacher);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [updatedTeacher, setUpdatedTeacher] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        gender: "",
        specialist_in: "",
    });

    const openModal = () => {
        setModal(true);
        setUpdatedTeacher(teacher);
    };

    useEffect(() => {
        const getTeacher = async () => {
            try {
                dispatch(teacherStart());
                const { data } = await AuthService.getTeacher(id);
                dispatch(getTeacherSuccess(data));
            } catch (error) {
                dispatch(teacherFailure(error.response?.data.message));
                await Toast.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message,
                });
            }
        };

        getTeacher();
    }, [id]);

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-3xl">account credentials</h1>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-[14px] pb-2 border-cyan-600 text-cyan-600">teacher</p>
            </div>

            <div className="w-fit border-2 py-8 px-6 my-20 rounded shadow-dim">
                <div className="flex justify-start gap-10">
                    <figure className={`w-[100px] h-[100px] rounded-[50%] overflow-hidden bg-slate-100 mt-5 ${!teacher ? "bg-gray-300 animate-pulse" : null}`}>
                        {teacher ? <img className="w-full h-full object-cover" src={logo} alt="logo" /> : null}
                    </figure>

                    {!teacher ?
                        <ProfileCardSkeleton />
                        :
                        <div className="flex flex-col gap-1">
                            <h1 className="capitalize text-4xl">{teacher.first_name}</h1>
                            <h2 className="capitalize text-2xl">{teacher.last_name}</h2>
                            <h3 className="text-[14px] mt-1">{teacher.email}</h3>
                            <div className="flex gap-6 text-[14px]">
                                <h4 className="flex gap-2"><span className="text-gray-400">Date of Bithday:</span> <span>{teacher.dob}</span></h4>
                                <h4 className="flex gap-2"><span className="text-gray-400">Phone:</span> <span>+{teacher.contactNumber}</span></h4>
                            </div>
                            <div className="flex gap-6 text-[14px]">
                                <h4 className="flex gap-4"><span className="text-gray-400">Specialist in:</span> {teacher.specialist_in}</h4>
                                <h4 className="flex gap-4"><span className="text-gray-400">Gender:</span> <span className="capitalize">{teacher.gender}</span></h4>
                            </div>
                        </div>
                    }

                    <div>
                        <button disabled={teacher ? false : true} onClick={() => openModal()} className="border-2 rounded ml-16 px-6 py-1 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">{teacher ? "Edit" : "Loading..."}</button>
                    </div>
                </div>
            </div>

            {/* profile edit modal */}
            <TeacherEditModal
                teacher={teacher}
                modal={modal}
                setModal={setModal}
                updatedTeacher={updatedTeacher}
                setUpdatedTeacher={setUpdatedTeacher}
            />
        </div>
    )
}

export default TeacherInfo