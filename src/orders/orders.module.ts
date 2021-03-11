import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../node_modules/@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderResovler } from './order.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [OrderService, OrderResovler],
})
export class OrdersModule {}
