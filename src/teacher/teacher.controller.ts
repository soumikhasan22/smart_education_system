// // teacher.controller.ts
// import { Controller, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
// import { TeacherService } from './teacher.service';
// import { CreateTeacherDto } from './dto/create-teacher.dto';

// @Controller('teachers')
// export class TeacherController {
//   constructor(private readonly teacherService: TeacherService) {}

//   // Add a new teacher
//   @Post()
//   async addTeacher(@Body() createTeacherDto: CreateTeacherDto) {
//     const newTeacher = await this.teacherService.addTeacher(createTeacherDto);
//     return {
//       message: 'Teacher added successfully!',
//       teacher: newTeacher,
//     };
//   }

//   // Assign courses to a teacher
//   @Patch(':id/assign-courses')
//   async assignCoursesToTeacher(
//     @Param('id', ParseIntPipe) teacherId: number,
//     @Body('courseIds') courseIds: number[],
//   ) {
//     const teacher = await this.teacherService.assignCourseToTeacher(
//       teacherId,
//       //courseIds,
//     );
//     return {
//       message: 'Courses assigned to teacher successfully!',
//       teacher,
//     };
//   }
// }
