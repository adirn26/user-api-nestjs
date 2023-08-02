import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async signin(dto: AuthDto) {
        //find by user email
        const user = await this.usersRepository.findOne({
            where: {
                email: dto.email
            }
        })

        //if user doesnt exist throw exception
        if(!user)
        throw new ForbiddenException(
            'Credential Incorrect'
        );
        //check password

        const pwMatches = await bcrypt.compare(dto.password, user.hash);

        //if password incorrect throw exception
        if(!pwMatches)
        throw new ForbiddenException(
            'Credentials incorrect'
        )
        delete user.hash
        return this.signToken(user.id, user.email);
    }

    async signup(dto: AuthDto) {
        console.log(dto);

        //generate hash password 
        const hash = await bcrypt.hash(dto.password, 10);

        //save the user
        try {
            const user = await this.usersRepository.save({
                email: dto.email, 
                hash
            });
            delete user.hash;
            return user;
        } catch (error) {
            throw new ForbiddenException('Credentials taken')
        }
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const data = {
            sub: userId, 
            email
        }

        const token = await this.jwtService.signAsync(data, {
            expiresIn: '15m', 
            secret: this.config.get('JWT-SECRET')
        })

        return {
            access_token: token
        }
    }
}
