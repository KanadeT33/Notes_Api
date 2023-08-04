import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private repo: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const {password} = createUserDto;
      const hashedPassword = await bcrypt.hash(password, salt);
      createUserDto.password = hashedPassword;
    } catch (error) {
      throw error;
    }
    return this.repo.insert(createUserDto);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(name: string) {
    return this.repo.findBy({ name });
  }
  async findOneByEmail(name: string) {
    const user = await this.repo.findOneBy({ name });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
