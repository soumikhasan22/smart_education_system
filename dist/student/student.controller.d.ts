import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    findAll(): Promise<import("./entities/student.entity").Student[]>;
    findOne(id: number): Promise<import("./entities/student.entity").Student>;
    create(createStudentDto: CreateStudentDto): Promise<import("./entities/student.entity").Student>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<import("./entities/student.entity").Student & UpdateStudentDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
