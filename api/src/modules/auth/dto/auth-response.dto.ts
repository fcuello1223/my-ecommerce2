import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

//Data Transfer Object for Auth Response
export class AuthResponseDto {
  @ApiProperty({
    description: 'Access Token for Authentication',
    example:
      'b7da8933e2784791bc87f0f337c41692b7479a77fff3cdbb9c0371612282da48a13fef66f691612bc5f931a93fa77598333462a6487027d4912c4323a9d3b87f',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh Token for Obtaining New Access Tokens',
    example:
      'b7da8933e2784791bc87f0f337c41692b7479a77fff3cdbb9c0371612282da48a13fef66f691612bc5f931a93fa77598333462a6487027d4912c4323a9d3b87f',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Authenticated User Info',
    example: {
      id: 'user-123',
      email: '<EMAIL>',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  })
  user!: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
