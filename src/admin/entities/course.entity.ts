import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Unique } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity()
@Unique(['coursecode'])  
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('varchar')
  fee: string;

  @Column()
  coursecode: string;  

  @ManyToMany(() => Teacher, teacher => teacher.courses, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  teachers: Teacher[];
  
  @ManyToMany(() => Student, student => student.courses, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  students: Student[];
  
}
