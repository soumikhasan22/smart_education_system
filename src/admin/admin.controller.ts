import { Controller, Post, Body, Get, Query, UseGuards, Req, BadRequestException, HttpCode, HttpStatus, Put, Param, Delete, HttpException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminEditProfileDto } from './dto/admin-edit-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { AddTeacherDto } from './dto/add-teacher.dto';
import { AddCourseDto } from './dto/add-course.dto';
import { AssignCourseDto } from './dto/assign-course.dto';


@Controller('admin')
export class AdminController {
  courseService: any;
  studentService: any;
  teacherService: any;
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  async signup(@Body() adminSignupDto: AdminSignupDto) {
    return this.adminService.signup(adminSignupDto);
  }

  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req): Promise<{ message: string }> {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.adminService.blacklistToken(token);
      return { message: 'Logged out successfully' };
    }
    return { message: 'No token provided' };
  }
  
  
  @Get('verify') 
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query('email') email: string, @Query('uniqueCode') uniqueCode: string) {
    if (!email || !uniqueCode) {
      throw new BadRequestException('Email and unique code are required');
    }
    return this.adminService.verifyEmail(email, uniqueCode);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addAdmin(@Body() adminSignupDto: AdminSignupDto) {
    return this.adminService.signup(adminSignupDto);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchAdmin(@Query('query') query: string) {
    if (!query || query.trim() === '') {
      throw new BadRequestException('Search query cannot be empty.');
    }
    
    return this.adminService.searchAdmin(query.trim());
  }

@Post('editProfile')
@UseGuards(JwtAuthGuard)
async editProfile(@Req() req, @Body() adminEditProfileDto: AdminEditProfileDto) {
  const loggedInEmail = req.user.email;
  return this.adminService.editProfile(loggedInEmail, adminEditProfileDto);
}



@UseGuards(JwtAuthGuard) 
@Put('changePassword')
async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto): Promise<string> {
  const email = req.user.email;
  return this.adminService.changePassword(email, changePasswordDto);
}

@Post('forgotPassword')
async forgotPassword(@Body('email') email: string) {
  return this.adminService.sendPasswordResetEmail(email);
}

@Post('reset-password')
async resetPassword(@Body() resetPasswordDto: { token: string, newPassword: string }) {
  const { token, newPassword } = resetPasswordDto;
  return this.adminService.resetPassword(token, newPassword);
}

// Students
@Post('addStudent')
@UseGuards(JwtAuthGuard)
addStudent(@Body() addStudentDto: AddStudentDto) {
  return this.adminService.addStudent(addStudentDto);
}

@Delete('student/:id')
@UseGuards(JwtAuthGuard)
deleteStudent(@Param('id') id: number) {
  return this.adminService.deleteStudent(id);
}

@Get('student/search')
@UseGuards(JwtAuthGuard)
async searchStudent(@Query('query') query: string) {
  return await this.adminService.searchStudent(query);
}


// Teachers
@Post('addTeacher')
@UseGuards(JwtAuthGuard)
addTeacher(@Body() addTeacherDto: AddTeacherDto) {
  return this.adminService.addTeacher(addTeacherDto);
}

@Delete('teacher/:id')
@UseGuards(JwtAuthGuard)
deleteTeacher(@Param('id') id: number) {
  return this.adminService.deleteTeacher(id);
}

@Get('teacher/search')
@UseGuards(JwtAuthGuard)
async searchTeacher(@Query('query') query: string) {
  return await this.adminService.searchTeacher(query);
}


// Courses
@Post('addCourse')
@UseGuards(JwtAuthGuard)
addCourse(@Body() addCourseDto: AddCourseDto) {
  return this.adminService.addCourse(addCourseDto);
}

@Delete('course/:courseIdentifier')
@UseGuards(JwtAuthGuard)
async deleteCourse(@Param('courseIdentifier') courseIdentifier: string) {
  return await this.adminService.deleteCourse(courseIdentifier);
}



@Get('course/search')
@UseGuards(JwtAuthGuard)
async search(@Query('query') query: string) {
  
  if (!query || query.trim() === '') {
    return await this.adminService.searchCourse('');  
  }

 
  return await this.adminService.searchCourse(query.trim());
}





@Post('course/assign')
@UseGuards(JwtAuthGuard)
assignCourse(@Body() assignCourseDto: AssignCourseDto) {
  return this.adminService.assignCourse(assignCourseDto);
}



@Get('search-student-status')
@UseGuards(JwtAuthGuard)
  async searchStudentStatus(@Query('query') query: string) {
    try {
      return await this.adminService.searchStudentStatus(query); 
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search-teacher-status')
  @UseGuards(JwtAuthGuard)
  async searchTeacherStatus(@Query('query') query: string) {
    if (!query || query.trim() === '') {
      throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
    }

    
    const teacherStatuses = await this.adminService.searchTeacherStatus(query);
    return teacherStatuses;
  }
}
