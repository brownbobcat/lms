import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponse } from '../users/users.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result as unknown as UserResponse;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, role } = registerDto;

    const userExists = await this.usersRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.usersRepository.create({
        email,
        password: hashedPassword,
        fullName,
        role,
      });

      const savedUser = await this.usersRepository.save(user);

      const payload = {
        email: savedUser.email,
        sub: savedUser.id,
        role: savedUser.role,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: savedUser.id,
          email: savedUser.email,
          fullName: savedUser.fullName,
          role: savedUser.role,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      
      if (!user) {
        return;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');

      await this.usersRepository.update(user.id, {
        resetPasswordToken: resetToken, 
        resetPasswordExpires: new Date(Date.now() + 3600000),
      });

      const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
      await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
      throw new Error('Error processing password reset');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {

    try {
      const user = await this.usersRepository.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: MoreThan(new Date())
        }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password and clear reset token fields
      await this.usersRepository.update(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

    } catch (error) {
      throw new UnauthorizedException('Error resetting password');
    }
  }
}
