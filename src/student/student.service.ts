import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>, 
  ) {}

  // Create student
  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto); 
    return await this.studentRepository.save(student);  
  }

  // Find all students
  async findAll() {
    return this.studentRepository.find();  
  }

  // Find a student 
  async findOne(id: number) {
    return this.studentRepository.findOne({ where: { id } });  
  }

  // Update  student
  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({ where: { id } });  
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);  
    }
    
    const updatedStudent = Object.assign(student, updateStudentDto);
    return this.studentRepository.save(updatedStudent);  
  }

  // Remove student 
  async remove(id: number) {
    const student = await this.studentRepository.findOne({ where: { id } });  
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);  
    }
    await this.studentRepository.delete(id);  
    return { message: `Student with ID ${id} deleted successfully` };  
  }
}
