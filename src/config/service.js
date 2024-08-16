import api from "./api";
import { getCookie } from "./cookiesService";

// interceptor
api.interceptors.request.use((req) => {
    if (getCookie("x-token")) {
        req.headers.Authorization = getCookie("x-token")
    };
    return req;
});

const service = {
    // admin
    async adminLogin(admin) {
        const res = api.post("/admin/login", admin);
        return res;
    },
    async getMe(id) {
        const res = api.get(`/admin/me`);
        return res;
    },
    async getAdmin(id) {
        const res = api.get(`/admin/${id}`);
        return res;
    },
    async addNewAdmin(admin) {
        const res = api.post("/admin", admin);
        return res;
    },
    async getAllAdmin() {
        const res = api.get("/admin");
        return res;
    },
    async deleteAdmin(id) {
        const res = api.delete(`/admin/${id}`);
        return res;
    },
    async updateAdminProfile(id, updatedAdmin) {
        const res = api.put(`/admin/${id}`, updatedAdmin);
        return res;
    },
    async updateAdminPass(newPass) {
        const res = api.put("/admin/update-password", newPass);
        return res;
    },



    // Lead
    async addNewLead(lead) {
        const res = api.post("/leads", lead);
        return res;
    },
    async updateLead(id, updatedLead) {
        const res = api.put(`/leads/${id}`, updatedLead);
        return res;
    },
    async updateLeadColumn(id, newColumn) {
        const res = api.put(`/leads/column/${id}`, newColumn);
        return res;
    },
    async getAllLead() {
        const res = api.get("/leads");
        return res;
    },
    async deleteLead(id) {
        const res = api.delete(`/leads/${id}`);
        return res;
    },



    // Attendance
    async checkAttendance(attendance, groupId) {
        const res = api.post(`/attendance/check/${groupId}`, attendance);
        return res;
    },
    async getAllAttendance() {
        const res = api.get("/attendance");
        return res;
    },
    async deleteAttendance(student, date) {
        const res = api.delete(`/attendance/${student}/${date}`);
        return res;
    },



    // Student
    async addNewStudent(student) {
        const res = api.post("/student", student);
        return res;
    },
    async getAllStudents() {
        const res = api.get("/student");
        return res;
    },
    async getStudent(id) {
        const res = api.get(`/student/${id}`);
        return res;
    },
    async updateStudent(id, updatedStudent) {
        const res = api.put(`/student/${id}`, updatedStudent);
        return res;
    },
    async updateStudentPass(newPass) {
        const res = api.put("/student/update-password", newPass);
        return res;
    },
    async deleteStudent(id) {
        const res = api.delete(`/student/${id}`);
        return res;
    },
    async caclStudentBalance(req) {
        const res = api.put("/student/calc-balance", req);
        return res;
    },
    async payForStudent(req) {
        const res = api.post("/student/pay", req);
        return res;
    },
    async getStudentPayHistory() {
        const res = api.get("/student/pay-history");
        return res;
    },
    async updateStudentPay(id, data) {
        const res = api.put(`/student/pay-history/${id}`, data);
        return res;
    },
    async deleteStudentPay(id) {
        const res = api.delete(`/student/pay-history/${id}`);
        return res;
    },
    async deleteManyStudent(list) {
        const res = api.delete('/student/delete-many-students', { data: { studentIds: list } });
        return res;
    },



    // Company
    async createNewCompany(company) {
        const res = api.post('/company', company);
        return res;
    },
    async getCompany() {
        const res = api.get('/company');
        return res;
    },
    async updateCompany(company, id) {
        const res = api.put(`/company/${id}`, company);
        return res;
    },



    // Cost
    async createNewCost(cost) {
        const res = api.post('/costs', cost);
        return res;
    },
    async getAllCost() {
        const res = api.get('/costs');
        return res;
    },
    async updateCost(id, cost) {
        const res = api.put(`/costs/${id}`, cost);
        return res;
    },
    async deleteCost(id) {
        const res = api.delete(`/costs/${id}`);
        return res;
    },



    // Teacher
    async updateTeacher(id, updatedTeacher) {
        const res = api.put(`/teacher/${id}`, updatedTeacher);
        return res;
    },
    async updateTeacherPass(newPass) {
        const res = api.put("/teacher/update-password", newPass);
        return res;
    },
    async getTeacher(id) {
        const res = api.get(`/teacher/${id}`);
        return res;
    },
    async getAllTeachers() {
        const res = api.get("/teacher");
        return res;
    },
    async addNewTeacher(teacher) {
        const res = api.post("/teacher", teacher);
        return res;
    },
    async deleteTeacher(id) {
        const res = api.delete(`/teacher/${id}`);
        return res;
    },
    async calcTeacherSalary(id, date) {
        const res = api.put(`/teacher/calc-salary/${id}/${date}`);
        return res;
    },
    async setAllTeacherSalaryPer(percent) {
        const res = api.put('/teacher/update-all-teachers-salary-per', percent);
        return res;
    },
    async setTeacherSalaryPer(id, salaryPer) {
        const res = api.put(`/teacher/update-teacher-salary-per/${id}`, { salaryPer });
        return res;
    },



    // Notice
    async getAllNotices() {
        const res = api.get("/notices");
        return res;
    },
    async addNewNotice(notice) {
        const res = api.post("/notices", notice);
        return res;
    },
    async updateNotice(id, updatedNotice) {
        const res = api.put(`/notices/${id}`, updatedNotice);
        return res;
    },
    async deleteNotice(id) {
        const res = api.delete(`/notices/${id}`);
        return res;
    },



    // Course
    async getCourse(id) {
        const res = api.get(`/courses/${id}`);
        return res;
    },
    async getAllCourses() {
        const res = api.get("/courses");
        return res;
    },
    async addNewCourse(course) {
        const res = api.post("/courses", course);
        return res;
    },
    async updateCourse(id, updatedCourse) {
        const res = api.put(`/courses/${id}`, updatedCourse);
        return res;
    },
    async deleteCourse(id) {
        const res = api.delete(`/courses/${id}`);
        return res;
    },



    // Room
    async getRoom(id) {
        const res = api.get(`/rooms/${id}`);
        return res;
    },
    async getAllRooms() {
        const res = api.get("/rooms");
        return res;
    },
    async addNewRoom(room) {
        const res = api.post("/rooms", room);
        return res;
    },
    async updateRoom(id, updatedRoom) {
        const res = api.put(`/rooms/${id}`, updatedRoom);
        return res;
    },
    async deleteRoom(id) {
        const res = api.delete(`/rooms/${id}`);
        return res;
    },



    // Group
    async getGroup(id) {
        const res = api.get(`/groups/${id}`);
        return res;
    },
    async getAllGroups() {
        const res = api.get("/groups");
        return res;
    },
    async addNewGroup(group) {
        const res = api.post("/groups", group);
        return res;
    },
    async updateGroup(id, updatedGroup) {
        const res = api.put(`/groups/${id}`, updatedGroup);
        return res;
    },
    async deleteGroup(id) {
        const res = api.delete(`/groups/${id}`);
        return res;
    },
    async removeFromGroup(studentId) {
        const res = api.delete(`/groups/remove-from-group/${studentId}`);
        return res;
    },



    // date
    async getCurrentDate() {
        const res = api.get("get-current-date");
        return res;
    },
};

export default service;