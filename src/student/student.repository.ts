import { EntityRepository, Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {
  
}
