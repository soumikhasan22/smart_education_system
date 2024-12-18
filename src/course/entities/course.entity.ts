// course.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
//import { Teacher } from 'src/teacher/entities/teacher.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseName: string;

  @Column()
  fee: number;

  @Column({ nullable: true })
  courseDetails: string;

  // @ManyToMany(() => Teacher, (teacher) => teacher.courses)
  // teachers: Teacher[];
}
