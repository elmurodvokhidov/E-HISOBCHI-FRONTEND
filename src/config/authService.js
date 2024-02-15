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
        const res = api.post("/admin/login", admin);
        return res;
    },
    async getAdmin(id) {
        const res = api.get(`/admin/info/${id}`);
        return res;
    },
    async updateAdminProfile(id, updatedAdmin) {
        const res = api.put(`/admin/update-profile/${id}`, updatedAdmin);
        return res;
    },
    async updateAdminPass(newPass) {
        const res = api.put("/admin/update-password", newPass);
        return res;
    },
    async getAllTeachers() {
        const res = api.get("/admin/get-all-teacher");
        return res;
    },
    async addNewTeacher(teacher) {
        const res = api.post("/admin/add-teacher", teacher);
        return res;
    },



    // teacher
    async teacherLogin(teacher) {
        const res = api.post("/teacher/login", teacher);
        return res;
    },
    async getTeacher(id) {
        const res = api.get(`/teacher/info/${id}`);
        return res;
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