import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async getUsers() {
        const users = await this.usersService.findAll();
        return users.filter((user) => {
            delete user.hash;
            return user;
        });
    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOne(id);
        delete user.hash;
        return user;
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id:number){
        await this.usersService.remove(id);
        return 'User deleted !';
    }

}
