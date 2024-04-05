import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import AuthService from "../config/authService";
import { useDispatch, useSelector } from "react-redux";
import { allStudentSuccess, studentStart } from "../redux/slices/studentSlice";
import { Link } from "react-router-dom";

export default function SearchBar() {
    const { students } = useSelector(state => state.student);
    const dispatch = useDispatch();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllStudents = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getAllStudents();
            dispatch(allStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.message));
        }
    };

    useEffect(() => {
        getAllStudents();
    }, []);

    const handleSearchFunc = (value) => {
        setResults(students.filter(student => (
            value && student && student.first_name &&
            student.first_name.toLowerCase().includes(value)
        )));
        setIsLoading(false);
    };

    return (
        <div className="w-1/4 m-auto relative flex flex-col items-center min-w-52">
            <div className={`w-full h-10 flex items-center rounded-xl px-4 bg-gray-100 ${results.length > 0 ? 'rounded-b-none rounded-t-md' : ''}`}>
                <input onChange={(e) => handleSearchFunc(e.target.value)} className="w-full h-full ml-1 text-sm border-none focus:outline-none bg-transparent" type="text" placeholder="Qidiruv" />
                <FaSearch className="cursor-pointer text-gray-500 hover:text-cyan-600" />
            </div>
            <div className={`w-full max-h-64 absolute top-6 flex flex-col mt-4 rounded-b-md overflow-y-auto bg-white shadow-md`}>
                {
                    results.length > 0 ? results.map((result, index) => (
                        <Link
                         to={`/admin/student-info/${result._id}`} 
                         className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100" key={index}><FaSearch className="text-gray-500" />{result.first_name} {result.last_name}</Link>
                    )) : null
                }
            </div>
        </div>
    )
}