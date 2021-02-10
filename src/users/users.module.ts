import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';
import { ConfigService } from '../../node_modules/@nestjs/config';
import { JwtModule } from '../jwt/jwt.module';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserResolver, UserService]
})
export class UsersModule {}
