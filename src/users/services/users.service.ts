import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(name: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { name } });
  }

  async createOne({
    name,
    password,
  }: Pick<User, 'name' | 'password'>): Promise<User> {
    return await this.usersRepository.save({
      name,
      password,
    });
  }
}
