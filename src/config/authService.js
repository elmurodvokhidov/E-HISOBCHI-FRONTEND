import api from "./api";
import { getCookie } from "./cookiesService";

// interceptor
api.interceptors.request.use((req) => {
    if (getCookie("x-token")) {
        req.headers.Authorization = getCookie("x-token")
    };
    return req;
});

const AuthService = {
    // admin
    async adminLogin(admin) {
        const res = api.post("/admin/login", admin);
        return res;
    },
    async getAdmin(id) {
        const res = api.get(`/admin/info/${id}`);
        return res;
    },
    async addNewAdmin(admin) {
        const res = api.post("/admin/add-new-admin", admin);
        return res;
    },
    async getAllAdmin() {
        const res = api.get("/admin/get-all-admin");
        return res;
    },
    async deleteAdmin(id) {
        const res = api.delete(`/admin/delete-admin/${id}`);
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
    async updateTeacher(id, updatedTeacher) {
        const res = api.put(`/admin/update-teacher/${id}`, updatedTeacher);
        return res;
    },
    async updateTeacherPass(newPass) {
        const res = api.put("/admin/update-teacher-password", newPass);
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
    async deleteTeacher(id) {
        const res = api.delete(`/admin/delete-teacher/${id}`);
        return res;
    },
    async addNewStudent(student) {
        const res = api.post("/admin/add-student", student);
        return res;
    },
    async getAllStudents() {
        const res = api.get("/admin/get-all-student");
        return res;
    },
    async updateStudent(id, updatedTeacher) {
        const res = api.put(`/admin/update-student/${id}`, updatedTeacher);
        return res;
    },
    async updateStudentPass(newPass) {
        const res = api.put("/admin/update-student-password", newPass);
        return res;
    },
    async deleteStudent(id) {
        const res = api.delete(`/admin/delete-student/${id}`);
        return res;
    },
    async addNewLead(lead) {
        const res = api.post("/admin/add-lead", lead);
        return res;
    },
    async updateLead(id, updatedLead) {
        const res = api.put(`/admin/update-lead/${id}`, updatedLead);
        return res;
    },
    async updateLeadColumn(id, newColumn) {
        const res = api.put(`/admin/update-lead-columt/${id}`, newColumn);
        return res;
    },
    async getAllLead() {
        const res = api.get("/admin/get-all-lead");
        return res;
    },
    async deleteLead(id) {
        const res = api.delete(`/admin/delete-lead/${id}`);
        return res;
    },
    async checkAttendance(attendance, groupId) {
        const res = api.post(`/admin/check-attendance/${groupId}`, attendance);
        return res;
    },
    async getAllAttendance() {
        const res = api.get("/admin/attendance");
        return res;
    },
    async deleteAttendance(student, date) {
        const res = api.delete(`/admin/attendance-delete/${student}/${date}`);
        return res;
    },
    async caclStudentBalance(req) {
        const res = api.put("/admin/calc-student-balance", req);
        return res;
    },
    async payForStudent(req) {
        const res = api.post("/admin/student-pay", req);
        return res;
    },
    async getStudentPayHistory() {
        const res = api.get("/admin/get-student-pay-history");
        return res;
    },
    async updateStudentPay(id, data) {
        const res = api.put(`/admin/update-student-pay-history/${id}`, data);
        return res;
    },
    async deleteStudentPay(id) {
        const res = api.delete(`/admin/delete-student-pay/${id}`);
        return res;
    },
    async createNewCompany(company) {
        const res = api.post('/admin/create-new-company', company);
        return res;
    },
    async getCompany() {
        const res = api.get('/admin/get-company');
        return res;
    },
    async updateCompany(company, id) {
        const res = api.put(`/admin/update-company/${id}`, company);
        return res;
    },
    async createNewCost(cost) {
        const res = api.post('/admin/create-new-cost', cost);
        return res;
    },
    async getAllCost() {
        const res = api.get('/admin/get-cost');
        return res;
    },
    async updateCost(id, cost) {
        const res = api.put(`/admin/update-cost/${id}`, cost);
        return res;
    },
    async deleteCost(id) {
        const res = api.delete(`/admin/delete-cost/${id}`);
        return res;
    },
    async setAllTeacherSalaryPer(percent) {
        const res = api.put('/admin/update-all-teachers-salary-per', percent);
        return res;
    },
    async setTeacherSalaryPer(id, salaryPer) {
        const res = api.put(`/admin/update-teacher-salary-per/${id}`, { salaryPer });
        return res;
    },
    async deleteManyStudent(list) {
        const res = api.delete('/admin/delete-many-students', { data: { studentIds: list } });
        return res;
    },
    async calcTeacherSalary(id, date) {
        const res = api.put(`/admin/calc-teacher-salary/${id}/${date}`);
        return res;
    },



    // Notice
    async getAllNotices() {
        const res = api.get("/admin/get-notice");
        return res;
    },
    async addNewNotice(notice) {
        const res = api.post("/admin/create-notice", notice);
        return res;
    },
    async updateNotice(id, updatedNotice) {
        const res = api.put(`/admin/update-notice/${id}`, updatedNotice);
        return res;
    },
    async deleteNotice(id) {
        const res = api.delete(`/admin/delete-notice/${id}`);
        return res;
    },



    // Course
    async getCourse(id) {
        const res = api.get(`/admin/get-course/${id}`);
        return res;
    },
    async getAllCourses() {
        const res = api.get("/admin/get-all-course");
        return res;
    },
    async addNewCourse(course) {
        const res = api.post("/admin/add-course", course);
        return res;
    },
    async updateCourse(id, updatedCourse) {
        const res = api.put(`/admin/update-course/${id}`, updatedCourse);
        return res;
    },
    async deleteCourse(id) {
        const res = api.delete(`/admin/delete-course/${id}`);
        return res;
    },



    // Room
    async getRoom(id) {
        const res = api.get(`/admin/get-room/${id}`);
        return res;
    },
    async getAllRooms() {
        const res = api.get("/admin/get-all-rooms");
        return res;
    },
    async addNewRoom(room) {
        const res = api.post("/admin/add-room", room);
        return res;
    },
    async updateRoom(id, updatedRoom) {
        const res = api.put(`/admin/update-room/${id}`, updatedRoom);
        return res;
    },
    async deleteRoom(id) {
        const res = api.delete(`/admin/delete-room/${id}`);
        return res;
    },



    // Group
    async getGroup(id) {
        const res = api.get(`/admin/get-group/${id}`);
        return res;
    },
    async getAllGroups() {
        const res = api.get("/admin/get-all-groups");
        return res;
    },
    async addNewGroup(group) {
        const res = api.post("/admin/add-group", group);
        return res;
    },
    async updateGroup(id, updatedGroup) {
        const res = api.put(`/admin/update-group/${id}`, updatedGroup);
        return res;
    },
    async deleteGroup(id) {
        const res = api.delete(`/admin/delete-group/${id}`);
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
        const res = api.post("/student/login", student);
        return res;
    },
    async getStudent(id) {
        const res = api.get(`/student/info/${id}`);
        return res;
    },

    // date
    async getCurrentDate() {
        const res = api.get("get-current-date");
        return res;
    },
};

export default AuthService;