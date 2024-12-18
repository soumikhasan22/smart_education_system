// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Teacher } from 'src/teacher/entities/teacher.entity';
// import { Course } from 'src/course/entities/course.entity';

// @Injectable()
// export class TeacherService {
//   constructor(
//     @InjectRepository(Teacher)
//     private readonly teacherRepository: Repository<Teacher>,
//     @InjectRepository(Course)
//     private readonly courseRepository: Repository<Course>,
//   ) {}

//   async assignCourseToTeacher(teacherId: number, courseId: number): Promise<any> {
//     const teacher = await this.teacherRepository.findOne(teacherId, { relations: ['courses'] });
//     const course = await this.courseRepository.findOne(courseId);
    
//     if (!teacher || !course) {
//       throw new Error('Teacher or Course not found.');
//     }

//     // Check if the course is already assigned to the teacher
//     if (teacher.courses.some((assignedCourse) => assignedCourse.id === courseId)) {
//       throw new Error('Course already assigned to this teacher.');
//     }

//     teacher.courses.push(course);
//     await this.teacherRepository.save(teacher);

//     return { message: 'Course assigned to teacher successfully!' };
//   }
// }
