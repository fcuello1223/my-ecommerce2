import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

//Data Transfer Object for User Registration
export class RegisterDto {
  @ApiProperty({
    description: 'User E-Mail Address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please Enter a Valid E-Mail Address!' })
  @IsNotEmpty({ message: 'E-Mail Required!' })
  email!: string;

  @ApiProperty({
    description: 'User Password',
    example: 'StrongP@ssword123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password Required!' })
  @MinLength(8, { message: 'Password Must Be At Least 8 Characters Long!' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password Must Contain At Least 1 Uppercase Letter, 1 Lowercase Letter, 1 Number, and 1 Special Character!',
    },
  )
  password!: string;

  @ApiProperty({
    description: 'User First Name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User Last Name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
