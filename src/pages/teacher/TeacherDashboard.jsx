import { useDispatch, useSelector } from "react-redux";
import TimeTable from "../../components/charts/TimeTable";
import AuthService from "../../config/authService";
import { allGroupSuccess } from "../../redux/slices/groupSlice";
import { allRoomSuccess } from "../../redux/slices/roomSlice";
import { useEffect } from "react";

function TeacherDashboard() {
    const { auth } = useSelector(state => state.auth);
    const { groups } = useSelector(state => state.group);
    const { rooms } = useSelector(state => state.room);
    const dispatch = useDispatch();

    useEffect(() => {
        const getAllGroupsFunction = async () => {
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        };
        const getAllRoomsFunction = async () => {
            const { data } = await AuthService.getAllRooms();
            dispatch(allRoomSuccess(data));
        };

        getAllGroupsFunction();
        getAllRoomsFunction();
    }, []);

    return (
        <div className="container">
            <section className="shadow-smooth">
                <TimeTable
                    rooms={rooms}
                    groups={groups}
                    teacher={auth?._id}
                />
            </section>
        </div>
    )
}

export default TeacherDashboard