import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Register API
  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Register a New User',
    description: 'Creates a New User Account',
  })
  @ApiResponse({
    status: 201,
    description: 'User Successfully Registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation Failed or User Already Exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }

  //Refresh Access Token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('JWT-refresh')
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Generates a New Access Token Using a Valid Refresh Token',
  })
  @ApiResponse({
    status: 200,
    description: 'New Access Token Generated Successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or Expired Refresh Token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async refresh(@GetUser('id') userId: string): Promise<AuthResponseDto> {
    return await this.authService.refreshTokens(userId);
  }

  //Logout User and Invalidate Refresh Token
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout User',
    description: 'Logs Out the User and Invalidates the Refresh Token',
  })
  @ApiResponse({
    status: 200,
    description: 'User Successfully Logged Out',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or Expired Refresh Token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: 'Successfully Logged Out!' };
  }

  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticates a User and Returns Access and Refresh Tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User Successfully Logged In',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or Expired Refresh Token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
