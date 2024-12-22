import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Teacher {
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

  @Column()
  qualifications: string;

  @ManyToMany(() => Course, course => course.teachers)
  @JoinTable()
  courses: Course[];
  static email: string;
}
