import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CourseAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coursecode: string;

  @Column()
  courseName: string;

  @Column({ nullable: true })
  teacherName: string;

  @Column({ nullable: true })
  teacherEmail: string;

  @Column({ nullable: true })
  studentName: string;

  @Column({ nullable: true })
  studentEmail: string;

  @Column()
  assignedAt: string; 
}
