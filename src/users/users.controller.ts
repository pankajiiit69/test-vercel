import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('check-db')
  async checkDb() {
    return this.usersService.checkDatabaseAccess();
  }
}