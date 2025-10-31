import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // CREATE USER
  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser)
      throw new ConflictException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
const { password, ...result } = savedUser;
    return result;
  }

  // GET ALL USERS
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // GET USER BY ID
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: String(id) },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // UPDATE USER
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) throw new ConflictException('Email already in use');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.getUserById(id);
  }

  // DELETE USER
  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  // LOGIN USER
  async login(email: string, password: string): Promise<{ token: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        select: ['id', 'email', 'password'],
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      const token = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      });

      // return both
      return { token };
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  //Signup user
  async signup(createUserDto: CreateUserDto): Promise<{ token: string }> {
    await this.createUser(createUserDto);
    return this.login(createUserDto.email, createUserDto.password);
  }
}