import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

function Navbar() {
    const { user } = useSelector(state => state.auth);
    return (
        <div>
            {
                user ?
                    <>
                        <NavLink to="/">Home</NavLink>
                    </> :
                    <>
                        <NavLink to="admin/login">Login</NavLink>
                    </>
            }
        </div>
    )
}

export default Navbar