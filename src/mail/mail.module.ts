import { Module, DynamicModule } from '@nestjs/common';
import { MailModuleOptions } from './mail.interface';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Module({})
export class MailModule {
    static forRoot(options: MailModuleOptions): DynamicModule {
        return {
            module: MailModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [],
        };
    }
}