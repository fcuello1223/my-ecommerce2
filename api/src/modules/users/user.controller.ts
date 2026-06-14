import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './user.service';

import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';

import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Get User Profile
  @Get('me')
  @ApiOperation({ summary: 'Get Current User Profile' })
  @ApiResponse({
    status: 200,
    description: 'The Current User Profile',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return await this.usersService.findOne(req.user.id);
  }

  //Get All Users (For Admin Purposes)
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({
    status: 200,
    description: 'List of all Users',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  //Get User By ID (For Admin Purposes)
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get User By ID' })
  @ApiResponse({
    status: 200,
    description: 'The User With the Specified ID',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User Not Found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  //Update Current User Profile
  @Patch('me')
  @ApiOperation({ summary: 'Update Current User Profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The Updated User Profile',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'E-Mail Already In Use',
  })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(userId, updateUserDto);
  }

  //Change Current User Password
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change Current User Password' })
  @ApiResponse({ status: 200, description: 'Password Changed Successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.usersService.changePassword(userId, changePasswordDto);
  }

  //Delete Current User Account
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Current User Account' })
  @ApiResponse({
    status: 200,
    description: 'User Account Deleted Successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteAccount(
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    return await this.usersService.remove(userId);
  }

  //Delete User Account by ID (For Admin Purposes)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete User By ID' })
  @ApiResponse({
    status: 200,
    description: 'User Account Deleted Successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return await this.usersService.remove(id)
  }
}

/**{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTZkMzM1NS01MTBlLTRmNGUtOWFjYi1mOThjZjkyMWE2MDIiLCJlbWFpbCI6ImFsbWF0b3NAZXhlY3V0aXZlYmFuay5jb20iLCJpYXQiOjE3ODE0NTY0NTcsImV4cCI6MTc4MTQ1NzM1N30.jdJqhHgxk30q_wSOdQWSD2HAy3h0s41cys8bRZk2xjo",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTZkMzM1NS01MTBlLTRmNGUtOWFjYi1mOThjZjkyMWE2MDIiLCJlbWFpbCI6ImFsbWF0b3NAZXhlY3V0aXZlYmFuay5jb20iLCJyZWZyZXNoSWQiOiJlY2NiODc4MTZlNGRlNzgxNjgyMjc3YjdhMDJlM2Y4NCIsImlhdCI6MTc4MTQ1NjQ1NywiZXhwIjoxNzgyMDYxMjU3fQ.TBJw598c7ss9I2XuZ4GcM9KYbmB1Py1toKxepkJOyQU",
  "user": {
    "id": "556d3355-510e-4f4e-9acb-f98cf921a602",
    "email": "almatos@executivebank.com",
    "firstName": "Ana",
    "lastName": "Matos",
    "role": "ADMIN"
  }
} */
