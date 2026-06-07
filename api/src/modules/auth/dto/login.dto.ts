import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please Provide a Valid E-Mail Address!' })
  @IsNotEmpty({ message: 'E-Mail is Required!' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is Required!' })
  password!: string;
}
