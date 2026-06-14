import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RolesGuard]
})
export class UserModule {}
