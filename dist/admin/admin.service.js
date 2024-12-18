"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("./entities/admin.entity");
const bcrypt = require("bcrypt");
let AdminService = class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async create(createAdminDto) {
        const { email, password } = createAdminDto;
        const existingAdmin = await this.adminRepository.findOne({ where: { email } });
        if (existingAdmin) {
            throw new common_1.BadRequestException('Admin with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
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
    async login(loginDto) {
        const { email, password } = loginDto;
        const admin = await this.adminRepository.findOne({ where: { email } });
        if (!admin) {
            throw new common_1.NotFoundException('Account not found.');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Incorrect password.');
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
    async findAll() {
        return await this.adminRepository.find();
    }
    async findOne(id) {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${id} not found`);
        }
        return admin;
    }
    async update(id, updateAdminDto) {
        const admin = await this.findOne(id);
        if (updateAdminDto.password) {
            updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
        }
        Object.assign(admin, updateAdminDto);
        return await this.adminRepository.save(admin);
    }
    async remove(id) {
        const result = await this.adminRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Admin with ID ${id} not found`);
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map