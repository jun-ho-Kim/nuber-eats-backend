import { Module } from '@nestjs/common';
import { APP_GUARD } from '../../node_modules/@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AuthModule {}
