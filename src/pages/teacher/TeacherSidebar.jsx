import { useSelector } from "react-redux";
import { SlLayers } from "react-icons/sl";
import { PiHandCoinsLight } from "react-icons/pi";
import { NavLink } from "react-router-dom";

function TeacherSidebar() {
    const { auth } = useSelector(state => state.auth);

    return (
        <div className="sidebar pt-20 h-screen overflow-auto bg-white shadow-smooth">
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