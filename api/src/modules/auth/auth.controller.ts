import { Body, Controller } from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //Register API
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto>
  
}
