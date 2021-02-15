import { Module, DynamicModule, Global} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CONFIG_OPTION } from './jwt.constants';
import { JwtModuleOption } from './jwt.interface';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOption) : DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [ 
        {
          provide: CONFIG_OPTION,
          useValue: options,
        },
        JwtService
    ]
    }
  }
}
