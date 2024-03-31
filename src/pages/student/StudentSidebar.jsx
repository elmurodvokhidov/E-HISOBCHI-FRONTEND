import { SlLayers } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function StudentSidebar() {
    const { auth } = useSelector(state => state.auth);

    return (
        <div className="sidebar pt-20 h-screen overflow-auto bg-white shadow-smooth">
            {
                auth &&
                <NavLink
                    to={`/student/course-info/${auth.group.course._id}`}
                    className="w-32 relative flex flex-col items-center gap-2 py-4 hover:text-cyan-600 transition-all duration-300"
                    key={auth.group.course._id}>
                    <SlLayers className="text-3xl" />
                    <h1 className="text-xs">{auth.group.course.title}</h1>
                </NavLink>
            }
        </div>
    )
}

export default StudentSidebar