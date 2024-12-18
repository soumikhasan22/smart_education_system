import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';  

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  // Create a new Admin
  async create(createAdminDto: AdminSignupDto): Promise<{ message: string, admin: Partial<Admin> }> {
    const { email, password } = createAdminDto;

    // Check  email already exists
    const existingAdmin = await this.adminRepository.findOne({ where: { email } });
    if (existingAdmin) {
      throw new BadRequestException('Admin with this email already exists');
    }

    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin and save
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword, 
    });

    const savedAdmin = await this.adminRepository.save(admin);

    return {
      message: 'Admin created successfully!',
      admin: {
        id: savedAdmin.id,
        name: savedAdmin.name,
        email: savedAdmin.email,
        isActive: savedAdmin.isActive,
      
      },
    };
  }

  // Login  Admin
  async login(loginDto: LoginDto): Promise<{ message: string, admin: Partial<Admin> }> {
    const { email, password } = loginDto;

    // Check  admin exists 
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException('Account not found.');
    }

    // Check password matches
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password.');
    }

    return {
      message: 'Login successful!',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive,
      },
    };
  }

  // Get all Admins
  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  // Get  Admin 
  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  // Update Admin
  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);

    if (updateAdminDto.password) {
      
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    
    Object.assign(admin, updateAdminDto);

    return await this.adminRepository.save(admin);
  }

  // Delete  Admin
  async remove(id: number): Promise<void> {
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }
}
