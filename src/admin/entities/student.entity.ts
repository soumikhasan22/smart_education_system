import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column()
  address: string;

  @ManyToMany(() => Course, course => course.students)
  @JoinTable()
  courses: Course[];
  static email: string;
}
