import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UsersService } from '../users/services/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 验证用户
  async validateUser(username: string, password: string): Promise<any> {
    try {
      // 查找用户
      const user = await this.usersService.findByUsername(username);
      
      // 验证密码
      const isPasswordValid = this.verifyPassword(password, user.password);
      
      if (isPasswordValid) {
        // 返回用户信息（不包含密码）
        const { password, ...result } = user.toJSON();
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  // 验证密码
  private verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const hashedInput = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hashedInput === hash;
  }

  // 用户登录
  async login(user: any) {
    // 创建JWT载荷
    const payload = { username: user.username, sub: user.id, role: user.role };
    
    // 生成访问令牌
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 获取当前用户信息
  async getProfile(userId: number) {
    return this.usersService.findOne(userId);
  }

  // 用户注册
  async register(registerDto: RegisterDto) {
    try {
      // 检查用户名是否已存在
      const existingUserByUsername = await this.usersService.findByUsername(registerDto.username);
      if (existingUserByUsername) {
        throw new ConflictException('用户名已存在');
      }
    } catch (error) {
      // 如果是用户不存在的错误，则继续执行
      if (error instanceof ConflictException) {
        throw error;
      }
    }

    try {
      // 检查邮箱是否已存在
      const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
      if (existingUserByEmail) {
        throw new ConflictException('邮箱已被使用');
      }
    } catch (error) {
      // 如果是用户不存在的错误，则继续执行
      if (error instanceof ConflictException) {
        throw error;
      }
    }

    // 创建用户（密码加密由用户服务处理）
    const newUser = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password, // 传递原始密码，让用户服务加密
      role: 'user', // 默认角色为普通用户
    });

    // 生成JWT令牌
    const payload = { username: newUser.username, sub: newUser.id, role: newUser.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}