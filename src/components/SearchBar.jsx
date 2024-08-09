import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function SearchBar({ modals, handleModal }) {
    const { students } = useSelector(state => state.student);
    const [results, setResults] = useState([]);

    const handleSearchFunc = (value) => {
        setResults(students.filter(student => (
            value && student && student.first_name &&
            student.first_name.toLowerCase().includes(value)
        )));
        handleModal("searchBarModal", true)
    };

    return (
        <div className="w-1/4 m-auto relative flex flex-col items-center min-w-52">
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-full h-10 flex items-center rounded-xl px-4 pc:py-2 bg-gray-100 ${results.length > 0 ? 'rounded-b-none rounded-t-md' : ''}`}>
                <input
                    onChange={(e) => handleSearchFunc(e.target.value)}
                    type="text"
                    placeholder="Qidiruv"
                    className="w-full h-full ml-1 pc:text-lg text-base border-none focus:outline-none bg-transparent"
                />
                <FaSearch
                    onClick={() => handleModal("searchBarModal", true)}
                    className="cursor-pointer text-base pc:text-lg text-gray-500 hover:text-main-1" />
            </div>
            <div className={`w-full max-h-64 absolute top-6 flex flex-col mt-4 rounded-b-md overflow-y-auto bg-white shadow-md`}>
                {
                    results.length > 0 && modals.searchBarModal ? results.map((result, index) => (
                        <Link
                            to={`/admin/student-info/${result._id}`}
                            className="flex items-center gap-4 px-5 py-3 pc:text-lg hover:bg-gray-100" key={index}><FaSearch className="text-gray-500" />{result.first_name} {result.last_name}</Link>
                    )) : null
                }
            </div>
        </div>
    )
}