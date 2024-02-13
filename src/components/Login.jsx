import React from 'react'
import { NavLink } from 'react-router-dom'

function Login() {
    return (
        <div>
            <h1>Who are you?</h1>
            <NavLink to="admin/login">Admin</NavLink>
            <NavLink to="teacher/login">Teacher</NavLink>
            <NavLink to="student/login">Student</NavLink>
        </div>
    )
}

export default Login