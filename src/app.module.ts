import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '12345@SWK'),
        database: configService.get<string>('DB_NAME', 'project_smart_edu_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, 
      }),
      inject: [ConfigService],
    }),


    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'hisoumik'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '30m') },
      }),
      inject: [ConfigService],
    }),

    
    AdminModule,
    StudentModule,
    TeacherModule,
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
