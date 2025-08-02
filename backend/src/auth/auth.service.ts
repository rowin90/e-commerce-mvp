import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/services/users.service';

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
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
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
}