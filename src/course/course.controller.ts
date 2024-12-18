import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findAll() {
    const courses = await this.courseService.findAll();
    if (!courses || courses.length === 0) {
      throw new NotFoundException('No courses found.');
    }
    return courses;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const course = await this.courseService.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }
    return course;
  }

  @Post()
async create(@Body() createCourseDto: CreateCourseDto) {
  
  const newCourse = await this.courseService.create(createCourseDto);
  return {
    message: 'Course added successfully!',
    course: newCourse,
  };
}

  

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const updatedCourse = await this.courseService.update(id, updateCourseDto);
    return {
      message: 'Course updated successfully!',
      course: updatedCourse,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.courseService.remove(id);
    return { message: 'Course deleted successfully!' };
  }
}
