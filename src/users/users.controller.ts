import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './auth/guards/auth.guard';
import {
  LoggedInUser,
  type RequestWithUser,
} from './decorators/user.decorator'
import { CustomBody } from './decorators/custombody.decoders';
import { UserRole } from './entities/user.entity';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { Auth } from './decorators/auth.decoders';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Get all users
  @ApiBearerAuth()
  @Get()
  @Auth(UserRole.ADMIN)
  getAllUsers(@Req() req: RequestWithUser) {
    const user = req.user;
    console.log(user);
    return this.usersService.getAllUsers();
  }

  // Get user by ID
  @Get(':id')
  @Auth(UserRole.USER)
  getUserById(@LoggedInUser() user, @Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // Admin-only endpoints (register/login handled below)

  // Create user 
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Create admin user (force role ADMIN) - public for testing only, protect this in production
  @Post('/admin/register')
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiBody({ type: CreateUserDto })
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    // Force role to ADMIN regardless of client-provided value
    const dto = { ...createUserDto, role: 'admin' } as CreateUserDto;
    return this.usersService.createUser(dto);
  }

  // Login
  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'strongPassword123' },
      },
    }
  })
  login(
    @CustomBody('email') email: string,
    @CustomBody('password') password: string,
  ) {
    return this.usersService.login(email, password);
  }
  // Update user
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // Delete user
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}