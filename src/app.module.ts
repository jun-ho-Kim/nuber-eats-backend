import { Module } from '@nestjs/common';
import { GraphQLModule} from "@nestjs/graphql";
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      /* autoSchemaFile을 true로 설정하면 schema.gql 파일이 자동생성되지 않고
      schama는 메모리에 저장된다. */
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }), 
    RestaurantsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'nuber-eats',
      synchronize: true,
      logging: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
