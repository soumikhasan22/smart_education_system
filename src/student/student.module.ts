import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';  
import { StudentRepository } from './student.repository';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentRepository]),  
  ],
  providers: [StudentService],  
  exports: [StudentService],  
})
export class StudentModule {}
