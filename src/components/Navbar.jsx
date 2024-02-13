import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import logo from "../img/uitc_logo.png"

function Navbar() {
    const { user } = useSelector(state => state.auth);
    return (
        <div className="w-full fixed top-0 flex items-center justify-between py-2 px-10 shadow-dim bg-white">
            <div className="logo w-14">
                <Link to="dashboard"><img src={logo} alt="logo" /></Link>
            </div>

            <div className="right">
                <Link to="profile" className="flex items-center gap-2">
                    <span className="text-[16px] text-black">{user?.first_name}</span>
                    <IoPersonCircleOutline className="text-3xl text-gray-500" />
                </Link>
            </div>
        </div>
    )
}

export default Navbar