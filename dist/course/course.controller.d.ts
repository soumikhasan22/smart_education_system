import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    findAll(): Promise<import("./entities/course.entity").Course[]>;
    findOne(id: number): Promise<import("./entities/course.entity").Course>;
    create(createCourseDto: CreateCourseDto): Promise<{
        message: string;
        course: import("./entities/course.entity").Course;
    }>;
    update(id: number, updateCourseDto: UpdateCourseDto): Promise<{
        message: string;
        course: import("./entities/course.entity").Course & UpdateCourseDto;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
