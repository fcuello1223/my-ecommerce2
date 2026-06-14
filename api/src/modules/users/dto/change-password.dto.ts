import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

//DTO for Changing a User's Password
export class ChangePasswordDto {
  @ApiProperty({
    description: 'New Password for the User',
    example: 'NewP@assword',
  })
  @IsString()
  @IsNotEmpty({ message: 'New Password Must Not Be Empty' })
  currentPassword!: string;

  @ApiProperty({
    description: 'New Password for the User',
    example: 'NewP@assword',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New Password Must Not Be Empty' })
  @MinLength(8, { message: 'New Password Must Be At Least 8 Characters Long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'New Password Must Contain at Least 1 Lowercase Letter, 1 Uppercase Letter, 1 Number, and 1 Special Character',
    },
  )
  newPassword!: string;
}
