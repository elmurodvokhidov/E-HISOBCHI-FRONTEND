import { SlLayers } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function StudentSidebar({ modals }) {
    const { auth } = useSelector(state => state.auth);

    return (
        <div className={`sidebar md:static absolute z-10 ${modals.sideModal ? "left-0" : "-left-full"} h-screen pt-20 overflow-y-auto shadow-smooth transition-all bg-white`}>
            {
                auth &&
                <NavLink
                    to={`/student/course-info/${auth?.group?.course?._id}`}
                    className="w-32 relative flex flex-col items-center gap-2 py-4 hover:text-cyan-600 transition-all duration-300"
                    key={auth?.group?.course?._id}>
                    <SlLayers className="text-3xl pc:text-4xl" />
                    <h1 className="text-xs pc:text-sm">{auth?.group?.course?.title}</h1>
                </NavLink>
            }
        </div>
    )
}

export default StudentSidebar