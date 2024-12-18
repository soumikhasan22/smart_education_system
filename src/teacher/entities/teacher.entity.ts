// // teacher.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
// import { Course } from 'src/course/entities/course.entity';

// @Entity()
// export class Teacher {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column()
//   email: string;

//   @Column()
//   qualifications: string;

//   @ManyToMany(() => Course, (course) => course.teachers)
//   @JoinTable()
//   courses: Course[];
// }
