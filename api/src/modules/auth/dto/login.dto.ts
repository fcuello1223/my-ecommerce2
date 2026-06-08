import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User E-Mail Address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please Provide a Valid E-Mail Address!' })
  @IsNotEmpty({ message: 'E-Mail is Required!' })
  email!: string;

  @ApiProperty({
    description: 'User Password',
    example: 'StrongP@ssword123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is Required!' })
  password!: string;
}
