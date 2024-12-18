"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_signup_dto_1 = require("./dto/admin-signup.dto");
const update_admin_dto_1 = require("./dto/update-admin.dto");
const common_2 = require("@nestjs/common");
const login_dto_1 = require("./dto/login.dto");
const student_service_1 = require("../student/student.service");
const create_student_dto_1 = require("../student/dto/create-student.dto");
const update_student_dto_1 = require("../student/dto/update-student.dto");
const course_service_1 = require("../course/course.service");
const update_course_dto_1 = require("../course/dto/update-course.dto");
const create_course_dto_1 = require("../course/dto/create-course.dto");
let AdminController = class AdminController {
    constructor(adminService, studentService, courseService) {
        this.adminService = adminService;
        this.studentService = studentService;
        this.courseService = courseService;
    }
    async signup(createAdminDto) {
        const result = await this.adminService.create(createAdminDto);
        return {
            message: result.message,
            admin: {
                id: result.admin.id,
                name: result.admin.name,
                email: result.admin.email,
                isActive: result.admin.isActive,
            },
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        try {
            const result = await this.adminService.login(loginDto);
            return {
                message: result.message,
                admin: result.admin,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException('Account not found.');
            }
            else {
                throw error;
            }
        }
    }
    async findAll() {
        const admins = await this.adminService.findAll();
        if (!admins || admins.length === 0) {
            throw new common_1.NotFoundException('No admin available.');
        }
        return admins;
    }
    async findOne(id) {
        const admin = await this.adminService.findOne(id);
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${id} not found.`);
        }
        return admin;
    }
    async update(id, updateAdminDto) {
        const admin = await this.adminService.findOne(id);
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${id} not found.`);
        }
        const updatedAdmin = await this.adminService.update(id, updateAdminDto);
        return {
            message: 'Admin updated successfully!',
            admin: updatedAdmin,
        };
    }
    async remove(id) {
        const admin = await this.adminService.findOne(id);
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${id} not found.`);
        }
        await this.adminService.remove(id);
        return {
            message: 'Admin deleted successfully!',
        };
    }
    async getAllStudents() {
        const students = await this.studentService.findAll();
        if (!students || students.length === 0) {
            throw new common_1.NotFoundException('No students found.');
        }
        return students;
    }
    async getStudentById(id) {
        console.log(`Fetching student with ID: ${id}...`);
        const student = await this.studentService.findOne(id);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found.`);
        }
        return student;
    }
    async addStudent(createStudentDto) {
        const newStudent = await this.studentService.create(createStudentDto);
        return {
            message: 'Student added successfully!',
            student: newStudent,
        };
    }
    async updateStudent(id, updateStudentDto) {
        const student = await this.studentService.findOne(id);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found.`);
        }
        const updatedStudent = await this.studentService.update(id, updateStudentDto);
        return {
            message: 'Student updated successfully!',
            student: updatedStudent,
        };
    }
    async removeStudent(id) {
        const student = await this.studentService.findOne(id);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found.`);
        }
        await this.studentService.remove(id);
        return {
            message: 'Student deleted successfully!',
        };
    }
    async getAllCourses() {
        const courses = await this.courseService.findAll();
        if (!courses || courses.length === 0) {
            throw new common_1.NotFoundException('No courses found.');
        }
        return {
            message: 'Courses fetched successfully!',
            courses: courses,
        };
    }
    async addCourse(createCourseDto) {
        const newCourse = await this.courseService.create(createCourseDto);
        return {
            message: 'Course added successfully!',
            course: newCourse,
        };
    }
    async updateCourse(id, updateCourseDto) {
        const updatedCourse = await this.courseService.update(id, updateCourseDto);
        return {
            message: 'Course updated successfully!',
            course: updatedCourse,
        };
    }
    async removeCourse(id) {
        await this.courseService.remove(id);
        return {
            message: 'Course deleted successfully!',
        };
    }
    async getCourseById(id) {
        const course = await this.courseService.findById(id);
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found.`);
        }
        return {
            message: 'Course matched successfully!',
            course: course,
        };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_signup_dto_1.AdminSignupDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllStudents", null);
__decorate([
    (0, common_1.Get)('students/:id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudentById", null);
__decorate([
    (0, common_1.Post)('students'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addStudent", null);
__decorate([
    (0, common_1.Patch)('students/:id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateStudent", null);
__decorate([
    (0, common_1.Delete)('students/:id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeStudent", null);
__decorate([
    (0, common_1.Get)('courses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Post)('courses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addCourse", null);
__decorate([
    (0, common_1.Patch)('courses/:id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Delete)('courses/:id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeCourse", null);
__decorate([
    (0, common_1.Get)('courses/:id'),
    __param(0, (0, common_1.Param)('id', common_2.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCourseById", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        student_service_1.StudentService,
        course_service_1.CourseService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map