import { Module, DynamicModule, Global} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOption } from './jwt.interface';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOption) : DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [ 
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService
    ]
    }
  }
}
