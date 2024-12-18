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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./entities/course.entity");
let CourseService = class CourseService {
    constructor(courseRepository) {
        this.courseRepository = courseRepository;
    }
    findAll() {
        return this.courseRepository.find();
    }
    findOne(id) {
        return this.courseRepository.findOne({ where: { id } });
    }
    async create(createCourseDto) {
        console.log('Creating course:', createCourseDto);
        const course = this.courseRepository.create(createCourseDto);
        const savedCourse = await this.courseRepository.save(course);
        console.log('Saved course:', savedCourse);
        return savedCourse;
    }
    async update(id, updateCourseDto) {
        const course = await this.findOne(id);
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found.`);
        }
        const updatedCourse = Object.assign(course, updateCourseDto);
        return this.courseRepository.save(updatedCourse);
    }
    async remove(id) {
        const course = await this.findOne(id);
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found.`);
        }
        await this.courseRepository.delete(id);
        return { message: `Course with ID ${id} deleted successfully!` };
    }
    async findById(id) {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CourseService);
//# sourceMappingURL=course.service.js.map