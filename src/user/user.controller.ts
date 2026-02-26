import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async postUser(@Body() dto: CreateUserDto) {
    const userId = await this.userService.postUser(dto.id1, dto.id2);
    return { userId };
  }
}
