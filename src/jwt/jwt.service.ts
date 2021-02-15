import { Injectable, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtModuleOption } from './jwt.interface';
import { CONFIG_OPTION } from './jwt.constants';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTION) private readonly option: JwtModuleOption,
    ) {}
    sign(userId: number): string {
        return jwt.sign({id: userId}, this.option.privateKey)
    }
}

