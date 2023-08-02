import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/entities/user.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'User',
    entities: [User],
    synchronize: true,
  }),
  ConfigModule.forRoot({isGlobal: true}),
  AuthModule, UsersModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
