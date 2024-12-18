import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { StudentModule } from '../student/student.module';
import { CourseModule } from '../course/course.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    StudentModule,
    CourseModule, 
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
