import { AdminService } from './admin.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from './dto/login.dto';
import { StudentService } from '../student/student.service';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { UpdateStudentDto } from '../student/dto/update-student.dto';
import { CourseService } from 'src/course/course.service';
import { UpdateCourseDto } from 'src/course/dto/update-course.dto';
import { CreateCourseDto } from 'src/course/dto/create-course.dto';
export declare class AdminController {
    private readonly adminService;
    private readonly studentService;
    private readonly courseService;
    constructor(adminService: AdminService, studentService: StudentService, courseService: CourseService);
    signup(createAdminDto: AdminSignupDto): Promise<{
        message: string;
        admin: {
            id: number;
            name: string;
            email: string;
            isActive: boolean;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        admin: Partial<import("./entities/admin.entity").Admin>;
    }>;
    findAll(): Promise<import("./entities/admin.entity").Admin[]>;
    findOne(id: number): Promise<import("./entities/admin.entity").Admin>;
    update(id: number, updateAdminDto: UpdateAdminDto): Promise<{
        message: string;
        admin: import("./entities/admin.entity").Admin;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getAllStudents(): Promise<import("../student/entities/student.entity").Student[]>;
    getStudentById(id: number): Promise<import("../student/entities/student.entity").Student>;
    addStudent(createStudentDto: CreateStudentDto): Promise<{
        message: string;
        student: import("../student/entities/student.entity").Student;
    }>;
    updateStudent(id: number, updateStudentDto: UpdateStudentDto): Promise<{
        message: string;
        student: import("../student/entities/student.entity").Student & UpdateStudentDto;
    }>;
    removeStudent(id: number): Promise<{
        message: string;
    }>;
    getAllCourses(): Promise<{
        message: string;
        courses: import("../course/entities/course.entity").Course[];
    }>;
    addCourse(createCourseDto: CreateCourseDto): Promise<{
        message: string;
        course: import("../course/entities/course.entity").Course;
    }>;
    updateCourse(id: number, updateCourseDto: UpdateCourseDto): Promise<{
        message: string;
        course: import("../course/entities/course.entity").Course & UpdateCourseDto;
    }>;
    removeCourse(id: number): Promise<{
        message: string;
    }>;
    getCourseById(id: number): Promise<{
        message: string;
        course: import("../course/entities/course.entity").Course;
    }>;
}
