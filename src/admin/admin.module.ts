import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { Course } from './entities/course.entity';
import { CourseAssignment } from './entities/assignment-course.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Admin,Student,Teacher, Course,CourseAssignment]),
    PassportModule,
    JwtModule.register({
      secret: 'hisoumik', 
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
  exports: [AdminService],
})
export class AdminModule {}
