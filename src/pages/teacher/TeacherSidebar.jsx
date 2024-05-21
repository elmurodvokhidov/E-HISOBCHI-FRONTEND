import { useSelector } from "react-redux";
import { SlLayers } from "react-icons/sl";
import { PiHandCoinsLight } from "react-icons/pi";
import { NavLink } from "react-router-dom";

function TeacherSidebar({ modals, handleModal, closeAllModals }) {
    const { auth } = useSelector(state => state.auth);

    return (
        <div className={`sidebar md:static absolute z-10 ${modals.sideModal ? "left-0" : "-left-full"} h-screen pt-20 overflow-y-auto shadow-smooth transition-all bg-white`}>
            {
                auth &&
                auth.groups.map(group => (
                    <NavLink
                        to={`/teacher/group-info/${group._id}`}
                        className="w-32 relative flex flex-col items-center gap-2 py-4 border-b"
                        key={group._id}>
                        <SlLayers className="text-3xl" />
                        <h1 className="text-xs">{group.name}</h1>
                    </NavLink>
                ))
            }
            <NavLink
                to="/teacher/salary"
                className="w-32 relative flex flex-col items-center gap-2 py-4">
                <PiHandCoinsLight className="text-3xl" />
                <h1 className="text-xs">Ish haqi</h1>
            </NavLink>
        </div>
    )
}

export default TeacherSidebar