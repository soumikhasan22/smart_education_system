import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminEditProfileDto } from './dto/admin-edit-profile.dto';
import * as crypto from 'crypto';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { Course } from './entities/course.entity';
import { AssignCourseDto } from './dto/assign-course.dto';
import { AddCourseDto } from './dto/add-course.dto';
import { AddTeacherDto } from './dto/add-teacher.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { CourseAssignment } from './entities/assignment-course.entity';




@Injectable()
export class AdminService {
  private tokenBlacklist: Set<string> = new Set();
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    private readonly jwtService: JwtService,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(CourseAssignment)
    private readonly courseAssignmentRepo: Repository<CourseAssignment>,
   
  ) {}

  async blacklistToken(token: string): Promise<void> {
    this.tokenBlacklist.add(token);
  }

  // Check if a token is blacklisted
  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }


  // Signup function
  async signup(adminSignupDto: AdminSignupDto): Promise<string> {
    const { name, address, phone, email, gender, nid, password } = adminSignupDto;


  
    const existingAdmin = await this.adminRepository.findOne({
      where: [{ email }, { nid }],
    });
    if (existingAdmin) {
      throw new BadRequestException('Email or NID already exists');
    }

    
    if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(phone)) {
      throw new BadRequestException('Invalid Bangladeshi phone number');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const uniqueCode = Math.random().toString(36).substr(2, 8);

    
    const admin = this.adminRepository.create({
      name,
      address,
      phone,
      email,
      gender,
      nid,
      password: hashedPassword,
      uniqueCode,
    });
    await this.adminRepository.save(admin);

    
    await this.sendVerificationEmail(email, uniqueCode);

    return 'Signup successful! Please check your email for verification.';
  }

  
  async verifyEmail(email: string, uniqueCode: string): Promise<string> {
    const admin = await this.adminRepository.findOne({ where: { email, uniqueCode } });
    if (!admin) {
      throw new BadRequestException('Invalid verification link');
    }

    if (admin.verified) {
      return 'Email is already verified.';
    }

    admin.verified = true;
    await this.adminRepository.save(admin);

    
    const newUniqueCode = Math.random().toString(36).substr(2, 8);
    admin.uniqueCode = newUniqueCode;
    await this.adminRepository.save(admin);

    await this.sendNewUniqueCodeEmail(email, newUniqueCode);

    return 'Email verified successfully! A new unique code has been sent to your email.';
  }

 
  async login(adminLoginDto: AdminLoginDto): Promise<{ message: string; accessToken: string }> {
    const { email, password, uniqueCode } = adminLoginDto;

    
    const admin = await this.adminRepository.findOne({ where: { email, uniqueCode } });
    if (!admin) {
      throw new BadRequestException('Invalid credentials or unique code');
    }

    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    
    if (!admin.verified) {
      throw new BadRequestException('Please verify your email first');
    }

    // JWT token
    const payload = { id: admin.id, email: admin.email };
    const accessToken = this.jwtService.sign(payload);

   
    await this.sendLoginNotification(email);

    return {
      message: 'Login successful!',
      accessToken,
    };
  }

  
  private async sendVerificationEmail(email: string, uniqueCode: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'teambcf27@gmail.com',
        pass: 'kryayzhbmjrajzfu', // Use a secure app password
      },
    });

    const verificationLink = `http://localhost:3000/admin/verify?email=${email}&uniqueCode=${uniqueCode}`;

    const mailOptions = {
      from: 'hbdoofficial.bd@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  
  private async sendNewUniqueCodeEmail(email: string, uniqueCode: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'teambcf27@gmail.com',
        pass: 'kryayzhbmjrajzfu', 
      },
    });

    const mailOptions = {
      from: 'Soumik',
      to: email,
      subject: 'New Unique Code',
      html: `
        <h1>Your New Unique Code</h1>
        <p>Your email has been successfully verified. Your new unique code for login:</p>
        <p><strong>${uniqueCode}</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

 
  private async sendLoginNotification(email: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'teambcf27@gmail.com',
        pass: 'kryayzhbmjrajzfu', 
      },
    });

    const mailOptions = {
      from: 'Nest',
      to: email,
      subject: 'Login Notification',
      text: `You successfully logged in at ${new Date().toLocaleString()} from a new device.`,
    };

    await transporter.sendMail(mailOptions);
  }
  
  
  async searchAdmin(query: string): Promise<any> {
    const admins = await this.adminRepository.find({
      where: [
        { name: Like(`%${query}%`) },  
        { email: Like(`%${query}%`) }, 
      ],
    });

    
    if (admins.length === 0) {
      throw new BadRequestException('No admin found.');
    }

    
    return admins;
  }

  // Edit Profile
  async editProfile(email: string, adminEditProfileDto: AdminEditProfileDto): Promise<string> {
   
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
  
    
    if (adminEditProfileDto.email && adminEditProfileDto.email !== admin.email) {
      throw new BadRequestException('You cannot change your email address.');
    }
  
    
    if (adminEditProfileDto.nid && adminEditProfileDto.nid !== admin.nid) {
      throw new BadRequestException('You cannot change your NID.');
    }
  
    
    Object.assign(admin, adminEditProfileDto);
  
    await this.adminRepository.save(admin);
  
    return 'Profile updated successfully';
  }
  
  
// change password 
async changePassword(email: string, changePasswordDto: ChangePasswordDto): Promise<string> {
  const { oldPassword, newPassword } = changePasswordDto;

  
  if (!oldPassword || !newPassword) {
    throw new BadRequestException('Old password and new password are required');
  }

  
  if (oldPassword === newPassword) {
    throw new BadRequestException('Old password and new password cannot be the same');
  }


  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new BadRequestException(
      'New password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character',
    );
  }

 
  const admin = await this.adminRepository.findOne({ where: { email } });
  if (!admin) {
    throw new BadRequestException('Admin not found');
  }

  
  const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
  if (!isPasswordValid) {
    throw new BadRequestException('Incorrect old password');
  }

  
  admin.password = await bcrypt.hash(newPassword, 10);
  await this.adminRepository.save(admin);

  return 'Password changed successfully';
}

// Send Password Reset Email
async sendPasswordResetEmail(email: string): Promise<string> {
  const admin = await this.adminRepository.findOne({ where: { email } });
  if (!admin) {
    throw new BadRequestException('Admin not found');
  }

  // reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date();
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

  console.log('Generated Reset Token:', resetToken); 
  console.log('Token Expiry:', resetTokenExpiry); 

  
  admin.resetToken = resetToken;
  admin.resetTokenExpiry = resetTokenExpiry;
  await this.adminRepository.save(admin);

  
  const resetLink = `http://localhost:3000/admin/reset-password?token=${resetToken}`;
  await this.sendPasswordResetEmailToAdmin(email, resetLink);

  return 'Password reset link has been sent to your email';
}


private async sendPasswordResetEmailToAdmin(email: string, resetLink: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'teambcf27@gmail.com',
      pass: 'kryayzhbmjrajzfu',
    },
  });

  const mailOptions = {
    from: 'teambcf27@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}




async generateResetToken(email: string): Promise<string> {
  const admin = await this.adminRepository.findOne({ where: { email } });

  if (!admin) {
    throw new BadRequestException('Admin not found');
  }

  
  const resetToken = Math.random().toString(36).substring(2, 15);

 
  const resetTokenExpiry = new Date();
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); 

 
  admin.resetToken = resetToken;
  admin.resetTokenExpiry = resetTokenExpiry;

  await this.adminRepository.save(admin);

  
  return resetToken;  
}
async resetPassword(resetToken: string, newPassword: string): Promise<string> {
  
  const admin = await this.adminRepository.findOne({ where: { resetToken } });

  
  if (!admin) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  
  if (admin.resetTokenExpiry && admin.resetTokenExpiry < new Date()) {
    console.log('Reset token expired at:', admin.resetTokenExpiry);
    throw new BadRequestException('Reset token has expired');
  }

  
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new BadRequestException(
      'Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character',
    );
  }

  
  const hashedPassword = await bcrypt.hash(newPassword, 10);  
  admin.password = hashedPassword;
  admin.resetToken = null;
  admin.resetTokenExpiry = null;

  await this.adminRepository.save(admin);
  return 'Password has been reset successfully. Please log in again with your new password.';
}






                                                                         // Students
async addStudent(dto: AddStudentDto) {
 
  if (!dto.name || !dto.email || !dto.phone || !dto.gender || !dto.address) {
    throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
  }

  
  if (!this.isValidEmail(dto.email)) {
    throw new HttpException('Email must be a Gmail address', HttpStatus.BAD_REQUEST);
  }

 
  const existingStudent = await this.studentRepo.findOne({ where: { email: dto.email } });
  if (existingStudent) {
    throw new HttpException('A student with this email already exists', HttpStatus.BAD_REQUEST);
  }

  try {
    
    const student = await this.studentRepo.save(dto);
    return { message: 'Student added successfully', student };
  } catch (error) {
    console.error('Error adding student:', error);
    throw new HttpException('Failed to add student', HttpStatus.BAD_REQUEST);
  }
}




isValidEmail(email: string): boolean {
 
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailPattern.test(email);
}


async deleteStudent(id: number) {
  const result = await this.studentRepo.delete(id);
  if (result.affected === 0) {
    throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
  }
  return { message: 'Student deleted successfully' };
}

async searchStudent(query: string): Promise<Student[] | string> {
  if (!query || query.trim() === '') {
    
    const students = await this.studentRepo.find();
    return students.length > 0 ? students : 'No students found.';
  }

  
  const students = await this.studentRepo.find({
    where: [
      { name: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ],
  });

  
  return students.length > 0 ? students : 'No students found.';
}


                                                  // Teachers

async addTeacher(dto: AddTeacherDto) {
  if (!dto.name || !dto.email || !dto.phone || !dto.gender || !dto.address) {
    throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
  }

  if (!this.isValidEmail(dto.email)) {
    throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
  }

  
  const existingTeacher = await this.teacherRepo.findOne({ where: { email: dto.email } });
  if (existingTeacher) {
    throw new HttpException('A teacher with this email already exists', HttpStatus.BAD_REQUEST);
  }

  try {
    const teacher = await this.teacherRepo.save(dto);
    return { message: 'Teacher added successfully', teacher };
  } catch (error) {
    throw new HttpException('Failed to add teacher', HttpStatus.BAD_REQUEST);
  }
}



async deleteTeacher(id: number) {
  const result = await this.teacherRepo.delete(id);
  if (result.affected === 0) {
    throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
  }
  return { message: 'Teacher deleted successfully' };
}

async searchTeacher(query: string): Promise<Teacher[] | string> {
  if (!query || query.trim() === '') {
  
    const teachers = await this.teacherRepo.find({ relations: ['courses'] });
    return teachers.length > 0 ? teachers : 'No teachers found.';
  }

  
  const teachers = await this.teacherRepo.find({
    where: [
      { name: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ],
    relations: ['courses'], 
  });

 
  return teachers.length > 0 ? teachers : 'No teachers found.';
}


                                                                // Courses


 
async addCourse(dto: AddCourseDto) {
  if (!dto.name || !dto.fee || !dto.coursecode) {
    throw new HttpException('Course name, course fee, and course code are required', HttpStatus.BAD_REQUEST);
  }

  
  const feeValue = parseFloat(dto.fee);
  if (isNaN(feeValue) || feeValue <= 0) {
    throw new HttpException('Course fee must be a positive number', HttpStatus.BAD_REQUEST);
  }

 
  const existingCourse = await this.courseRepo.findOne({ where: { coursecode: dto.coursecode } });
  if (existingCourse) {
    throw new HttpException('A course with this course code already exists', HttpStatus.BAD_REQUEST);
  }

  try {
    const course = this.courseRepo.create(dto); 
    await this.courseRepo.save(course); 
    return { message: 'Course added successfully', course };
  } catch (error) {
    throw new HttpException('Failed to add course', HttpStatus.BAD_REQUEST);
  }
}





async deleteCourse(courseIdentifier: string) {
  let courseToDelete: Course;

 
  courseToDelete = await this.courseRepo.findOne({
    where: { coursecode: courseIdentifier },
    relations: ['students', 'teachers'],  
  });

 
  if (!courseToDelete) {
    courseToDelete = await this.courseRepo.findOne({
      where: { name: courseIdentifier },
      relations: ['students', 'teachers'],
    });
  }

  if (!courseToDelete) {
    throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
  }

  
  courseToDelete.students.forEach(async student => {
    if (student.courses) {
      student.courses = student.courses.filter(c => c.id !== courseToDelete.id); 
      await this.studentRepo.save(student); 
    }
  });

 
  courseToDelete.teachers.forEach(async teacher => {
    if (teacher.courses) {  
      teacher.courses = teacher.courses.filter(c => c.id !== courseToDelete.id); 
      await this.teacherRepo.save(teacher); 
    }
  });

  
  await this.courseRepo.delete(courseToDelete.id);

  return { message: 'Course deleted successfully' };
}




async searchCourse(query: string): Promise<Course[] | string> {
 
  if (!query || query.trim() === '') {
    const courses = await this.courseRepo.find({
      relations: ['teachers', 'students'],  
    });

    if (courses.length === 0) {
      return 'No courses found.';
    }

    
    courses.forEach(course => {
      if (course.teachers.length === 0) {
        course.teachers = [{ name: 'No teacher assigned' }] as unknown as Teacher[];  
      }
      if (course.students.length === 0) {
        course.students = [{ name: 'No student enrolled' }] as unknown as Student[];  
      }
    });

    return courses;
  }

  
  const courses = await this.courseRepo.find({
    where: [
      { name: Like(`%${query}%`) },       
      { coursecode: Like(`%${query}%`) }, 
    ],
    relations: ['teachers', 'students'],  
  });

  if (courses.length === 0) {
    return 'No courses found.';
  }

  
  courses.forEach(course => {
    if (course.teachers.length === 0) {
      course.teachers = [{ name: 'No teacher assigned' }] as unknown as Teacher[];  
    }
    if (course.students.length === 0) {
      course.students = [{ name: 'No student enrolled' }] as unknown as Student[];  
    }
  });

  return courses;
}






                              // Assign course to teacher or student

async assignCourse(dto: AssignCourseDto) {
  if (!dto.coursecode || (!dto.teacherEmail && !dto.studentEmail)) {
    throw new HttpException('Course code and Teacher/Student email are required', HttpStatus.BAD_REQUEST);
  }

 
  const course = await this.courseRepo.findOne({
    where: { coursecode: dto.coursecode },
    relations: ['teachers', 'students'],
  });
  if (!course) {
    throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
  }

  
  const assignEntity = async (email: string, entityRepo: Repository<any>, role: string) => {
    const entity = await entityRepo.findOne({
      where: { email },
      relations: ['courses'],
    });

    if (!entity) {
      throw new HttpException(`${role} not found`, HttpStatus.NOT_FOUND);
    }

    
    if (entity.courses.some(c => c.id === course.id)) {
      throw new HttpException(`Course already assigned to this ${role.toLowerCase()}`, HttpStatus.BAD_REQUEST);
    }

    
    entity.courses.push(course);
    await entityRepo.save(entity);

    
    const courseAssignment = new CourseAssignment();
    courseAssignment.coursecode = course.coursecode;
    courseAssignment.courseName = course.name;
    courseAssignment.teacherName = role === 'Teacher' ? entity.name : '';
    courseAssignment.teacherEmail = role === 'Teacher' ? entity.email : '';
    courseAssignment.studentName = role === 'Student' ? entity.name : '';
    courseAssignment.studentEmail = role === 'Student' ? entity.email : '';
    courseAssignment.assignedAt = new Date().toISOString().split('T')[0]; 

    await this.courseAssignmentRepo.save(courseAssignment);
    return { message: `Course assigned to ${role} successfully`, [role.toLowerCase()]: entity };
  };

  
  if (dto.teacherEmail) {
    return await assignEntity(dto.teacherEmail, this.teacherRepo, 'Teacher');
  }

 
  if (dto.studentEmail) {
    return await assignEntity(dto.studentEmail, this.studentRepo, 'Student');
  }

  throw new HttpException('No valid teacher or student email provided', HttpStatus.BAD_REQUEST);
}



// Student Status
async searchStudentStatus(query: string): Promise<any> {
  if (!query || query.trim() === '') {
    throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
  }

 
  const students = await this.studentRepo.find({
    where: [
      { name: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ],
    relations: ['courses'],  
  });

  if (students.length === 0) {
    return 'No students found.';
  }

  
  const studentStatuses = students.map(student => {
    const totalFee = student.courses.reduce((acc, course) => acc + parseFloat(course.fee), 0); 
    return {
      studentName: student.name,
      email: student.email,
      courses: student.courses.map(course => ({
        courseName: course.name,
        courseCode: course.coursecode,
        fee: course.fee,
      })),
      totalFee,
    };
  });

  return studentStatuses;
}


// Teacher Status
async searchTeacherStatus(query: string): Promise<any> {
  if (!query || query.trim() === '') {
    throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
  }

  
  const teachers = await this.teacherRepo.find({
    where: [
      { name: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ],
    relations: ['courses'],  
  });

  if (teachers.length === 0) {
    return 'No teachers found.';
  }

  
  const teacherStatuses = teachers.map(teacher => {
    return {
      teacherName: teacher.name,
      email: teacher.email,
      courses: teacher.courses.map(course => ({
        courseName: course.name,
        courseCode: course.coursecode,
      })),
    };
  });

  return teacherStatuses;
}
}


