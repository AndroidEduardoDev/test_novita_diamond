// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(data: Partial<User>) {
    const existing = await this.userRepo.findOneBy({ username: data.username });
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    if (!data.password) {
      throw new ConflictException('Password is required');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    return this.userRepo.save(user);
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);
    user.updated = new Date();

    return this.userRepo.save(user);
  }

  async authenticate(
    username: string,
    password: string,
  ): Promise<{ authorised: boolean }> {
    const user = await this.userRepo.findOneBy({ username });

    if (!user) {
      return { authorised: false };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return { authorised: isMatch };
  }

}
