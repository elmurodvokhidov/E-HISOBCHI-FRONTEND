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
    async updateAdminProfile(id, updatedAdmin) {
        const response = api.put(`/admin/update-profile/${id}`, updatedAdmin);
        return response;
    },
    async updateAdminPass(newPass) {
        const response = api.put("/admin/update-password", newPass);
        return response;
    },
    async updateTeacher(id, updatedTeacher) {
        const response = api.put(`/admin/update-teacher/${id}`, updatedTeacher);
        return response;
    },
    async updateTeacherPass(newPass) {
        const response = api.put("/admin/update-teacher-password", newPass);
        return response;
    },
    async getAllTeachers() {
        const response = api.get("/admin/get-all-teacher");
        return response;
    },
    async addNewTeacher(teacher) {
        const response = api.post("/admin/add-teacher", teacher);
        return response;
    },
    async deleteTeacher(id) {
        const response = api.delete(`/admin/delete-teacher/${id}`);
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