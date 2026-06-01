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
  @IsEmail({}, { message: 'Please Enter a Valid E-Mail Address!' })
  @IsNotEmpty({ message: 'E-Mail Required!' })
  email!: string;

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

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
