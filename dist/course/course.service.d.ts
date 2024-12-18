import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CourseService {
    private courseRepository;
    constructor(courseRepository: Repository<Course>);
    findAll(): Promise<Course[]>;
    findOne(id: number): Promise<Course>;
    create(createCourseDto: CreateCourseDto): Promise<Course>;
    update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course & UpdateCourseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findById(id: number): Promise<Course>;
}
