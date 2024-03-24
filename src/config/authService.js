import api from "./api";

// interceptor
api.interceptors.request.use((req) => {
    if (localStorage.getItem("x-token")) {
        req.headers.Authorization = localStorage.getItem("x-token")
    };
    return req;
});

const AuthService = {
    // admin
    async adminLogin(admin) {
        const response = api.post("/admin/login", admin);
        return response;
    },
    async getAdmin(id) {
        const response = api.get(`/admin/info/${id}`);
        return response;
    },
    async addNewAdmin(admin) {
        const response = api.post("/admin/add-new-admin", admin);
        return response;
    },
    async getAllAdmin() {
        const response = api.get("/admin/get-all-admin");
        return response;
    },
    async deleteAdmin(id) {
        const response = api.delete(`/admin/delete-admin/${id}`);
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
    async addNewStudent(student) {
        const response = api.post("/admin/add-student", student);
        return response;
    },
    async getAllStudents() {
        const response = api.get("/admin/get-all-student");
        return response;
    },
    async updateStudent(id, updatedTeacher) {
        const response = api.put(`/admin/update-student/${id}`, updatedTeacher);
        return response;
    },
    async updateStudentPass(newPass) {
        const response = api.put("/admin/update-student-password", newPass);
        return response;
    },
    async deleteStudent(id) {
        const response = api.delete(`/admin/delete-student/${id}`);
        return response;
    },



    // Notice
    async getAllNotices() {
        const response = api.get("/admin/get-notice");
        return response;
    },
    async addNewNotice(notice) {
        const response = api.post("/admin/create-notice", notice);
        return response;
    },
    async updateNotice(id, updatedNotice) {
        const response = api.put(`/admin/update-notice/${id}`, updatedNotice);
        return response;
    },
    async deleteNotice(id) {
        const response = api.delete(`/admin/delete-notice/${id}`);
        return response;
    },



    // Course
    async getCourse(id) {
        const response = api.get(`/admin/get-course/${id}`);
        return response;
    },
    async getAllCourses() {
        const response = api.get("/admin/get-all-course");
        return response;
    },
    async addNewCourse(course) {
        const response = api.post("/admin/add-course", course);
        return response;
    },
    async updateCourse(id, updatedCourse) {
        const response = api.put(`/admin/update-course/${id}`, updatedCourse);
        return response;
    },
    async deleteCourse(id) {
        const response = api.delete(`/admin/delete-course/${id}`);
        return response;
    },



    // Room
    async getRoom(id) {
        const response = api.get(`/admin/get-room/${id}`);
        return response;
    },
    async getAllRooms() {
        const response = api.get("/admin/get-all-rooms");
        return response;
    },
    async addNewRoom(room) {
        const response = api.post("/admin/add-room", room);
        return response;
    },
    async updateRoom(id, updatedRoom) {
        const response = api.put(`/admin/update-room/${id}`, updatedRoom);
        return response;
    },
    async deleteRoom(id) {
        const response = api.delete(`/admin/delete-room/${id}`);
        return response;
    },



    // Group
    async getGroup(id) {
        const response = api.get(`/admin/get-group/${id}`);
        return response;
    },
    async getAllGroups() {
        const response = api.get("/admin/get-all-groups");
        return response;
    },
    async addNewGroup(group) {
        const response = api.post("/admin/add-group", group);
        return response;
    },
    async updateGroup(id, updatedGroup) {
        const response = api.put(`/admin/update-group/${id}`, updatedGroup);
        return response;
    },
    async deleteGroup(id) {
        const response = api.delete(`/admin/delete-group/${id}`);
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