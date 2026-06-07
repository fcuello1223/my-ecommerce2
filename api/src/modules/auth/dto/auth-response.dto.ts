import { Role } from "@prisma/client";

//Data Transfer Object for Auth Response
export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;
  user!: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role
  }
}
