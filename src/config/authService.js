import api from "./api";

// interceptor
api.interceptors.request.use((req) => {
    if (localStorage.getItem("x-token")) {
        req.headers.Authorization = localStorage.getItem("x-token")
    };
    return req;
});

const AuthService = {
    // admdin
    async adminLogin(admin) {
        const response = api.post("/admin/login", admin);
        return response;
    },
    async getAdmin(id) {
        const response = api.get(`/admin/info/${id}`);
        return response;
    },



    // teacher
    async teacherLogin(teacher) {
        const response = api.post("/teacher/login", teacher);
        return response;
    },
    async getTeacher(id) {
        const response = api.get(`/teacher/info/${id}`);
        return response;
    },



    // student
    async studentLogin(student) {
        const response = api.post("/student/login", student);
        return response;
    },
    async getStudent(id) {
        const response = api.get(`/student/info/${id}`);
        return response;
    },
};

export default AuthService;