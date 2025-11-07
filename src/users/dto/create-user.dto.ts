import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'John Doe',name: 'name', description: 'Full name of the user' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com', name: 'email', description: 'Email address of the user' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongPassword123', name: 'password', description: 'Password for the user account' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '+1234567890', name: 'phoneNumber', description: 'Contact phone number of the user', required: false })
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}