import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ParseIntPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto'; 
import { StudentService } from '../student/student.service';  
import { CreateStudentDto } from '../student/dto/create-student.dto'; 
import { UpdateStudentDto } from '../student/dto/update-student.dto';  
import { CourseService } from 'src/course/course.service';
import { UpdateCourseDto } from 'src/course/dto/update-course.dto';
import { CreateCourseDto } from 'src/course/dto/create-course.dto';

@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly studentService: StudentService,
    private readonly courseService: CourseService,
  ) {}

  // Signup Route (Create Admin)
  @Post('signup')
  async signup(@Body() createAdminDto: AdminSignupDto) {
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

  // Login Route
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const result = await this.adminService.login(loginDto);  
      return {
        message: result.message, 
        admin: result.admin,      
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Account not found.');
      } else {
        throw error;
      }
    }
  }

  // Get All Admins
  @Get()
  async findAll() {
    const admins = await this.adminService.findAll();
    if (!admins || admins.length === 0) {
      throw new NotFoundException('No admin available.');
    }
    return admins;
  }

  // Get Admin by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const admin = await this.adminService.findOne(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found.`);
    }
    return admin;
  }

  // Update Admin by ID
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminService.findOne(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found.`);
    }
    const updatedAdmin = await this.adminService.update(id, updateAdminDto);
    return {
      message: 'Admin updated successfully!',
      admin: updatedAdmin,  
    };
  }

  // Delete Admin by ID
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const admin = await this.adminService.findOne(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found.`);
    }
    await this.adminService.remove(id);
    return {
      message: 'Admin deleted successfully!',  
    };
  }

  // ---- Student Management Routes ----

  
  // Get all students
  @Get('students')
  async getAllStudents() {
    const students = await this.studentService.findAll();
    if (!students || students.length === 0) {
      throw new NotFoundException('No students found.');
    }
    return students;
  }

  // Get student by ID
  @Get('students/:id')
  async getStudentById(@Param('id', ParseIntPipe) id: number) {
    console.log(`Fetching student with ID: ${id}...`);
    const student = await this.studentService.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }
    return student;
  }

  // Add a new student
  @Post('students')
  async addStudent(@Body() createStudentDto: CreateStudentDto) {
    const newStudent = await this.studentService.create(createStudentDto);
    return {
      message: 'Student added successfully!',
      student: newStudent, 
    };
  }

  // Update student by ID
  @Patch('students/:id')
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.studentService.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }
    const updatedStudent = await this.studentService.update(id, updateStudentDto);
    return {
      message: 'Student updated successfully!',
      student: updatedStudent,  
    };
  }

  // Delete student by ID
  @Delete('students/:id')
  async removeStudent(@Param('id', ParseIntPipe) id: number) {
    const student = await this.studentService.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }
    await this.studentService.remove(id);
    return {
      message: 'Student deleted successfully!',  
    };
  }


 // ----Courses Management Routes ----

 
 // Get all courses
 @Get('courses')
 async getAllCourses() {
   const courses = await this.courseService.findAll();
   if (!courses || courses.length === 0) {
     throw new NotFoundException('No courses found.');
   }
   return {
     message: 'Courses fetched successfully!',
     courses: courses,
   };
 }

 // Add a new course
 @Post('courses')
 async addCourse(@Body() createCourseDto: CreateCourseDto) {
   const newCourse = await this.courseService.create(createCourseDto);
   return {
     message: 'Course added successfully!',
     course: newCourse,
   };
 }

 // Update a course
 @Patch('courses/:id')
 async updateCourse(
   @Param('id', ParseIntPipe) id: number,
   @Body() updateCourseDto: UpdateCourseDto,
 ) {
   const updatedCourse = await this.courseService.update(id, updateCourseDto);
   return {
     message: 'Course updated successfully!',
     course: updatedCourse,
   };
 }

 // Delete a course
 @Delete('courses/:id')
 async removeCourse(@Param('id', ParseIntPipe) id: number) {
   await this.courseService.remove(id);
   return {
     message: 'Course deleted successfully!',
   };
 }

 // Get a course by ID
 @Get('courses/:id')
 async getCourseById(@Param('id', ParseIntPipe) id: number) {
   const course = await this.courseService.findById(id);
   if (!course) {
     throw new NotFoundException(`Course with ID ${id} not found.`);
   }
   return {
     message: 'Course matched successfully!',
     course: course,
   };
 }
}