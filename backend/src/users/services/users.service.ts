import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as crypto from 'crypto';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // 获取所有用户
  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] }, // 排除密码字段
    });
  }

  // 获取单个用户
  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] }, // 排除密码字段
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 通过用户名查找用户（包含密码，用于认证）
  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  // 通过邮箱查找用户
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // 创建用户
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUsername = await this.userModel.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // 加密密码
    const hashedPassword = this.hashPassword(createUserDto.password);

    // 创建用户
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // 返回用户信息（不包含密码）
    const { password, ...result } = user.toJSON();
    return result as User;
  }

  // 更新用户
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // 检查邮箱是否已被其他用户使用
    if (updateUserDto.email) {
      const existingEmail = await this.userModel.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.userModel.update(updateUserDto, {
      where: { id },
    });

    return this.findOne(id);
  }

  // 删除用户
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  // 更新用户密码
  async updatePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 加密新密码
    const hashedPassword = this.hashPassword(newPassword);
    
    // 更新密码
    await user.update({ password: hashedPassword });
  }

  // 密码加密
  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }
}