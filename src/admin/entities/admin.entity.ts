import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  gender: string;

  @Column({ unique: true })
  nid: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  uniqueCode: string;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })  
  resetTokenExpiry: Date;

  @Column({ nullable: true })
  resetCode: string;

  @Column({ nullable: true })
  passwordChangedAt: Date;
}
