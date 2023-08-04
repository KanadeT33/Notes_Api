import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
  ) {}
  async login(body): Promise<any> {
    const login = await this.userRepo.findOneBy({ name: body.name });
    if (!login) {
      throw new UnauthorizedException('wrong credentials');
    }
    const { password, ...result } = login;
    if (bcrypt.compareSync(body.password, password)) {
      const payload = {
        name: login.name,
        id: login.id,
      };
      const token = await this.jwtService.signAsync(payload);
      return {
        message:"successfull login",
        access_token: token,
      };
    } else {
      throw new UnauthorizedException('wrong credentials');
    }
  }
  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userRepo.findOneBy({name});
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
