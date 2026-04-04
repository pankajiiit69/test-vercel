import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

  async getHello(): Promise<{ message: string; users: Array<{ id: number; username: string; name: string }> }> {
    const users = await this.usersService.findAll();

    return {
      message: 'Hello World from NestJS + TypeORM + PostgreSQL',
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        name: user.name,
      })),
    };
  }
}