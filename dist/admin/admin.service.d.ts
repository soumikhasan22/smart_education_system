import { Repository } from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from './dto/login.dto';
export declare class AdminService {
    private adminRepository;
    constructor(adminRepository: Repository<Admin>);
    create(createAdminDto: AdminSignupDto): Promise<{
        message: string;
        admin: Partial<Admin>;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        admin: Partial<Admin>;
    }>;
    findAll(): Promise<Admin[]>;
    findOne(id: number): Promise<Admin>;
    update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin>;
    remove(id: number): Promise<void>;
}
