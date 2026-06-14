import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'nrheijsoruigvhuriasog45454',
  })
  id!: string;

  @ApiProperty({ description: 'User E-Mail', example: 'johndoe@example.com' })
  email!: string;

  @ApiProperty({ description: 'User First Name', example: 'John', nullable: true })
  firstName!: string | null;

  @ApiProperty({ description: 'User Last Name', example: 'Doe', nullable: true })
  lastName!: string | null;

  @ApiProperty({ description: 'User Role', enum: Role })
  role!: Role;

  @ApiProperty({ description: 'Account Creation Date', example: '2023-10-01T12:34:56.789Z' })
  createdAt!: Date

  @ApiProperty({ description: 'Last Account Update Date', example: '2023-10-01T12:34:56.789Z' })
  updatedAt!: Date
}
