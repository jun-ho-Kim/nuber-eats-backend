import { Injectable, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtModuleOption } from './jwt.interface';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly option: JwtModuleOption,
    ) {}
    sign(userId: number): string {
        return jwt.sign({id: userId}, this.option.privateKey)
    }
    verify(token: string) {
        return jwt.verify(token, this.option.privateKey);
    }
}