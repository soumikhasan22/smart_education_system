import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  findAll() {
    return this.courseRepository.find();
  }

  findOne(id: number) {
    return this.courseRepository.findOne({ where: { id } });
  }

  async create(createCourseDto: CreateCourseDto) {
    console.log('Creating course:', createCourseDto);  
    const course = this.courseRepository.create(createCourseDto);
    const savedCourse = await this.courseRepository.save(course);
    console.log('Saved course:', savedCourse);  
    return savedCourse;
  }
  

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }
    const updatedCourse = Object.assign(course, updateCourseDto);
    return this.courseRepository.save(updatedCourse);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }
    await this.courseRepository.delete(id);
    return { message: `Course with ID ${id} deleted successfully!` };
  }

  async findById(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }
}
